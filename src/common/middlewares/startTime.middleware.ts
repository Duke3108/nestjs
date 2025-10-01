
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StartTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['startTime'] = Date.now();
    next();
  }
}
