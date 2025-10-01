import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.register(createAuthDto);
  }

  // @Post('/verify-email/:token')
  // async verifyEmail(@Param('token') token: string) {
  //   return await this.authService.verifyEmail(token);
  // }

  @Get('/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Post('/login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return await this.authService.login(email, password);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    return await this.authService.forgotPassword(email);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() { newPassword, token }: { newPassword: string; token: string },
  ) {
    return await this.authService.resetPassword(token, newPassword);
  }
}
