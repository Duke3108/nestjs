import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EntityManager } from 'typeorm';
import { GenericRepository } from 'repositories/genericRepository';
import brcypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from 'utils/jwt';
import makeToken from 'uniqid';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import otpGenerator from 'otp-generator';
import twilio from 'twilio';
import { MailService } from 'modules/mail/mail.service';
import { User } from 'entities/user.entity';

@Injectable()
export class AuthService {
  private readonly userRepository: GenericRepository<User>;
  constructor(
    manager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    this.userRepository = new GenericRepository(User, manager);
  }

  private formatPhoneNumber(phone: string): string {
    if (phone.startsWith('0')) {
      return '+84' + phone.substring(1);
    }
    return phone;
  }

  private static isCorrectPassword(
    inputPassword: string,
    hashedPassword: string,
  ): boolean {
    return !!brcypt.compareSync(inputPassword, hashedPassword);
  }

  async hashPassword(password: string) {
    const salt = await brcypt.genSalt(10);
    const hashPassword = await brcypt.hash(password, salt);
    return hashPassword;
  }

  async createPasswordChangeToken(userId: number) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepository.update(userId, {
      resetPwdToken: passwordResetToken,
      resetPwdExpires: passwordResetExpires,
    });
    return resetToken;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    if (!AuthService.isCorrectPassword(password, user.password)) return null;
    return user;
  }

  async register(userData: CreateAuthDto) {
    const token = makeToken();
    const user = await this.userRepository.findOne({
      where: [
        { email: userData.email },
        { phone: userData.phone, phoneVerified: true },
      ],
    });
    if (user) {
      if (user.emailVerified) {
        throw new BadRequestException('Email đã xác thực');
      } else if (
        user.email !== userData.email &&
        user.phone === userData.phone &&
        user.phoneVerified
      ) {
        throw new BadRequestException('Số điện thoại đã tồn tại');
      } else if (!user.emailVerified) {
        throw new BadRequestException(
          'Vui lòng kiểm tra email của bạn để xác thực tài khoản',
        );
      }
    }

    await this.userRepository.create({
      ...userData,
      password: await this.hashPassword(userData.password),
      registerToken: token,
      registerExpires: new Date(Date.now() + 15 * 60 * 1000),
    });
    await this.mailService.sendRegisterMail(userData.email, token);
    return {
      message: 'Vui lòng kiểm tra email của bạn',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        registerToken: token,
      },
    });
    if (!user) throw new BadRequestException('Token không hợp lệ');
    if (user.registerExpires && user.registerExpires < new Date()) {
      await this.userRepository.delete(user.id);
      throw new BadRequestException('Token đã hết hạn, vui lòng đăng ký lại');
    }
    await this.userRepository.update(user.id, {
      emailVerified: true,
      registerToken: null,
      registerExpires: null,
    });
    return { message: 'Xác thực tài khoản thành công' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    if (!user.emailVerified)
      throw new BadRequestException('Vui lòng xác thực email');
    if (password !== user.password)
      throw new BadRequestException('Sai mật khẩu');
    const newRefreshToken = generateRefreshToken(user.id);
    await this.userRepository.update(user.id, {
      refreshToken: newRefreshToken,
    });
    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return { message: 'Đăng nhập thành công', accessToken };
  }

  async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY as string,
    ) as { id: number };
    const user = await this.userRepository.findOne({
      where: {
        id: decoded.id,
      },
    });
    if (!user) throw new BadRequestException('Token không hợp lệ');
    const newAccessToken = generateAccessToken(decoded.id, user.role);
    return { message: 'Làm mới token thành công', accessToken: newAccessToken };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    if (!user.emailVerified)
      throw new BadRequestException('Vui lòng xác thực email');
    const token = await this.createPasswordChangeToken(user.id);
    await this.mailService.sendResetPasswordMail(email, token);
    return { message: 'Vui lòng kiểm tra email của bạn' };
  }

  async resetPassword(token: string, newPassword: string) {
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await this.userRepository.findOne({
      where: {
        resetPwdToken: passwordResetToken,
      },
    });
    if (!user) throw new BadRequestException('Token không hợp lệ');
    if (user.resetPwdExpires && user.resetPwdExpires < new Date()) {
      await this.userRepository.update(user.id, {
        resetPwdToken: null,
        resetPwdExpires: null,
      });
      throw new BadRequestException('Token đã hết hạn');
    }

    await this.userRepository.update(user.id, {
      password: await this.hashPassword(newPassword),
      resetPwdToken: null,
      resetPwdExpires: null,
      passwordChangedAt: new Date(),
    });

    return { message: 'Đặt lại mật khẩu thành công' };
  }

  async sendOtpToPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await this.userRepository.update(user.id, {
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    await this.sendSms(phone, `Mã OTP của bạn là: ${otp}`);
    return { message: 'Đã gửi mã OTP đến số điện thoại của bạn' };
  }

  async sendSms(phone: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    const to = this.formatPhoneNumber(phone);
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body,
      from,
      to,
    });
  }

  async verifyOtp(phone: string, otp: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    if (user.otp !== otp) throw new BadRequestException('Mã OTP không hợp lệ');
    if (user.otpExpires && user.otpExpires < new Date()) {
      await this.userRepository.update(user.id, {
        otp: null,
        otpExpires: null,
      });
      throw new BadRequestException('Mã OTP đã hết hạn');
    }
    await this.userRepository.update(user.id, {
      otp: null,
      otpExpires: null,
      phoneVerified: true,
    });
    return { message: 'Xác thực thành công' };
  }
}
