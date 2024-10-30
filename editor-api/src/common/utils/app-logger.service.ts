import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  getTimestamp(): string {
    return new Date().toISOString();
  }

  static getTimestamp(): string {
    return new Date().toISOString();
  }
}
