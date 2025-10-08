import { IsEmail } from 'class-validator';
import { StringRequired } from 'common/decorators/stringDecorator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @StringRequired('email')
  email: string;

  @StringRequired('tên đăng nhập')
  username: string;

  @StringRequired('mật khẩu')
  password: string;

  @StringRequired('họ và tên')
  fullname: string;

  @StringRequired('số điện thoại')
  phone: string;
}
