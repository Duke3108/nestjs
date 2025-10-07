import { StringRequired } from 'src/common/decorators';

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
