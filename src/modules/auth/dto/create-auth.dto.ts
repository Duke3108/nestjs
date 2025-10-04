import { StringRequired } from 'src/common/decorators/stringDecorator';

export class CreateAuthDto {
  @StringRequired('email')
  email: string;

  @StringRequired('mật khẩu')
  password: string;

  @StringRequired('họ và tên')
  fullname: string;

  @StringRequired('số điện thoại')
  phone: string;
}
