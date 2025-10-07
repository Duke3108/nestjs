import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalGuard } from './guards/local.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto, ResetPasswordDto, VerifyPhone } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @Post('/register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.register(createAuthDto);
  }

  // @Post('/verify-email/:token')
  // async verifyEmail(@Param('token') token: string) {
  //   return await this.authService.verifyEmail(token);
  // }

  @ApiOperation({ summary: 'Xác thực email' })
  @Get('/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  @Post('/login')
  @UseGuards(LocalGuard)
  async login(@Request() req) {
    return await this.authService.login(req.user.email, req.user.password);
  }

  @ApiOperation({ summary: 'Làm mới token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @Post('/refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    return await this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({ summary: 'Quên mật khẩu' })
  @ApiBody({ schema: { properties: { email: { type: 'string' } } } })
  @Post('/forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    return await this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiBody({ type: ResetPasswordDto })
  @Post('/reset-password')
  async resetPassword(
    @Body() { newPassword, token }: { newPassword: string; token: string },
  ) {
    return await this.authService.resetPassword(token, newPassword);
  }

  @ApiOperation({ summary: 'Gửi mã OTP đến số điện thoại' })
  @ApiBody({ schema: { properties: { phone: { type: 'string' } } } })
  @Post('/send-otp')
  async sendOtp(@Body() { phone }: { phone: string }) {
    return await this.authService.sendOtpToPhone(phone);
  }

  @ApiOperation({ summary: 'Xác thực mã OTP' })
  @ApiBody({ type: VerifyPhone })
  @Post('/verify-otp')
  async verifyOtp(@Body() { phone, otp }: { phone: string; otp: string }) {
    return await this.authService.verifyOtp(phone, otp);
  }
}
