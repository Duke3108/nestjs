import { StringRequired } from 'common/decorators/stringDecorator';

export class CreateUserDto {
  @StringRequired('email')
  email: string;

  @StringRequired('mật khẩu')
  password: string;

  @StringRequired('họ và tên')
  fullname: string;

  @StringRequired('số điện thoại')
  phone: string;
}
