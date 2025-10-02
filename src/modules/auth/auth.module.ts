import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { LocalGuard } from 'src/modules/auth/guards/local.guard';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, LocalGuard, LocalStrategy, JwtStrategy],
  imports: [
    UserModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
