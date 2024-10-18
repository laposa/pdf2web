import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLoggerService } from '../utils/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // log status once each ten minutes
  statusLogDelay = 10 * 60 * 1000;
  nextStatusLog = 0;

  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const contextName = `${context.getClass().name} - ${context.getHandler().name}`;
    const req = context.switchToHttp().getRequest();

    const ip =
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined;
    const url = req.originalUrl || req.url;

    if (context.getHandler().name === 'getStatus') {
      if (this.nextStatusLog > now) return next.handle();
      this.nextStatusLog = now + this.statusLogDelay;
    }

    return next.handle().pipe(
      tap(
        () => {
          setTimeout(() => {
            const res = context.switchToHttp().getResponse();
            this.logger.log(
              `${ip} ${req.method} ${url} ${res.statusCode} ${Date.now() - now}ms`,
              contextName,
            );
          });
        },
        () => {
          setTimeout(() => {
            const res = context.switchToHttp().getResponse();
            this.logger.error(
              `${ip} ${req.method} ${url} ${res.statusCode} ${Date.now() - now}ms`,
              '',
              contextName,
            );
          });
        },
      ),
    );
  }
}
