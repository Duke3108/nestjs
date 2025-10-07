import { IsEmail } from 'class-validator';
import { StringRequired } from '../../../common/decorators/stringDecorator';

export class LoginDto {
  @IsEmail()
  @StringRequired('email')
  email: string;

  @StringRequired('password')
  password: string;
}

export class ResetPasswordDto {
  @StringRequired('token')
  token: string;

  @StringRequired('newPassword')
  newPassword: string;
}

export class VerifyPhone {
  @StringRequired('phone')
  phone: string;
  @StringRequired('otp')
  otp: string;
}
