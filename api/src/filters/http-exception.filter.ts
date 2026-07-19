import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = exception instanceof HttpException ? exception.getResponse() : null;
    let message = 'Internal server error';
    if (typeof responseBody === 'string') message = responseBody;
    else if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
      const msg = (responseBody as { message: string | string[] }).message;
      message = Array.isArray(msg) ? msg[0] : msg;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    httpAdapter.reply(
      response,
      {
        success: false,
        statusCode: httpStatus,
        error: message,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
      },
      httpStatus,
    );
  }
}
