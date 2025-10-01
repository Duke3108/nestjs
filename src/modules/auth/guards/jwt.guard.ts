import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      request.user = {
        id: tokenPayload.id,
        role: tokenPayload.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ', error.message);
    }
  }
}
