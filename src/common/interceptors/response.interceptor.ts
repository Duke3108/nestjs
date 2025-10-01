
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/interfaces';


@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {

    private getDefaultMessage(method: string): string{
        switch (method) {
            case 'POST':
                return 'Tạo mới thành công'
            case 'PATCH':
                return 'Cập nhật thành công'
            case 'DELETE':
                return 'Xóa thành công'
            case 'GET':
                return 'Lấy dữ liệu thành công'
            default:
                return 'Yêu cầu đã hoàn thành'
        }
    }
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest()

    const startTime = request['startTime']
    const endTime = Date.now()
    const takenTime = endTime - startTime

    return next
    .handle()
    .pipe(map((data :any) => { 
        if(data && typeof data === 'object' && 'success' in data && 'message' in data){
            return data as ApiResponse<T>
        }
        let finalmessage = this.getDefaultMessage(request.method)

        if(data && typeof data === 'object' && 'message' in data){
            finalmessage = data.message as string
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {message, ...rest} = data
            data = Object.keys(rest).length > 0 ? rest : undefined
        }

        if(data && typeof data === 'object' && 'data' in data){
            data = data.data as T
        }

        return {
            success: true,
            message:finalmessage,
            data,
            date: new Date().toLocaleString('vi-VN',{
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
            takenTime: `${takenTime}ms`
        }
     }))
  }
}
