import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as _ from 'lodash';
import { AppLoggerService } from '../utils/app-logger.service';

@Catch()
export class AppFilter implements ExceptionFilter {
  private readonly logger = new AppLoggerService(AppFilter.name);

  catch(exception: Error & Record<string, any>, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = exception.message;
    let errorDetails;

    // Http based errors (nestjs and custom exceptions)
    if (exception instanceof HttpException && exception.getResponse()) {
      const errResponse = exception.getResponse() as any;

      // custom error details
      const details = _.omit(errResponse, ['message', 'statusCode', 'error']);
      if (Object.keys(details).length > 0) {
        errorDetails = details;
      }

      // validation error
      if (
        Array.isArray(errResponse.message) &&
        errResponse.message.length > 0
      ) {
        errorDetails = errResponse.message;
      }
    } else if (exception?.response) {
      // axios error
      const details = {
        req: _.pick(exception?.config, [
          'baseURL',
          'url',
          'method',
          'params',
          'data',
        ]),
        resp: {},
      };
      details.resp = exception?.response?.data || {};
      if (Object.keys(details.req).length && Object.keys(details.resp).length) {
        errorDetails = details;
      }
    }

    if (errorDetails) {
      errorMessage += `, Details: ${JSON.stringify(errorDetails)}`;
      this.logger.error(errorMessage);
    } else {
      this.logger.error(errorMessage, exception.stack);
    }

    res.status(status).json({
      status,
      message: exception.message,
      details: errorDetails,
    });
  }
}
