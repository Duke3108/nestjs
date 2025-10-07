import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const startTime = request['startTime'];
    const endTime = Date.now();
    const takenTime = endTime - startTime;

    let status: number;
    let message: string = 'Có lỗi xảy ra';
    let error: any;

    if (exception instanceof HttpException) {
      //lỗi có chủ đích HttpException
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const exceptionResponseObj = exceptionResponse as Record<string, any>;
        message =
          exceptionResponseObj.message ||
          exceptionResponseObj.error ||
          'Có lỗi xảy ra';

        //Lỗi validation DTO
        if (Array.isArray(exceptionResponseObj.message)) {
          message = 'Dữ liệu không hợp lệ.';
          error = exceptionResponseObj.message;
        }
      }
    } else {
      //lỗi ngoài ý muốn
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Hệ thống xảy ra lỗi không mong muốn';
      this.logger.error(exception);
    }

    const errorResponse: ApiResponse<any> = {
      success: false,
      message,
      ...(error ? { error } : {}),
      date: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      path: request.url,
      takenTime: `${takenTime}ms`,
    };

    response.status(status).json(errorResponse);
  }
}
