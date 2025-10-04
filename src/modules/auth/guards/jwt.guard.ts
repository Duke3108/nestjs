import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // cach 1 : ko xai strategy
  // constructor(private jwtService: JwtService) {
  //   super();
  // }

  // async canActivate(context: ExecutionContext) {
  //   const request = context.switchToHttp().getRequest();
  //   const authorization = request.headers['authorization'];
  //   const token = authorization && authorization.split(' ')[1];

  //   if (!token) {
  //     throw new UnauthorizedException('Vui lòng đăng nhập');
  //   }
  //   try {
  //     const tokenPayload = await this.jwtService.verifyAsync(token);
  //     request.user = {
  //       id: tokenPayload.id,
  //       role: tokenPayload.role,
  //     };
  //     return true;
  //   } catch (error) {
  //     throw new UnauthorizedException('Token không hợp lệ', error.message);
  //   }
  // }

  // cach 2 : xai strategy
  handleRequest<TUser = JwtPayload>(
    err: VerifyErrors | null,
    user: TUser | false | null,
    info?: { name?: string; message?: string },
  ): TUser {
    if (err) {
      throw new UnauthorizedException('Bạn không có quyền truy cập');
    }
    if (!user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');
      } else if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ');
      } else {
        throw new UnauthorizedException('Vui lòng đăng nhập');
      }
    }
    return user;
  }
}
