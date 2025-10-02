import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EntityManager } from 'typeorm';
import { GenericRepository } from 'src/repositories/genericRepository';
import { User } from 'src/modules/user/entities/user.entity';
import brcypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from 'src/utils/jwt';
import addMailJob, { MailJobData } from 'src/queues/mail.producer';
import makeToken from 'uniqid';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly userRepository: GenericRepository<User>;
  constructor(
    manager: EntityManager,
    private jwtService: JwtService,
  ) {
    this.userRepository = new GenericRepository(User, manager);
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
    const mailData: MailJobData = {
      email: userData.email,
      subject: 'Xác thực tài khoản',
      html: `<p>Vui lòng click vào đường link bên dưới để xác thực tài khoản (Lưu ý: liên kết này sẽ hết hạn sau 15 phút)</p>
      <a href="${process.env.URL_SERVER}/api/v1/auth/verify-email/${token}">Xác thực tài khoản</a>`,
    };

    await this.sendMail(mailData);
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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    if (!AuthService.isCorrectPassword(password, user.password)) return null;
    return user;
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
    const mailData: MailJobData = {
      email: user.email,
      subject: 'Đặt lại mật khẩu',
      html: `<p>Mã xác thực của bạn là: <strong>${token}</strong></p>`,
    };
    await this.sendMail(mailData);
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

  async sendMail(data: MailJobData): Promise<void> {
    await addMailJob(data);
  }
}
