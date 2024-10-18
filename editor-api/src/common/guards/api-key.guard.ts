import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfig, InjectConfig } from 'src/app.config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@InjectConfig() private readonly config: AppConfig) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Api key is required');
    }

    const apikey = request.headers.authorization.slice(7);
    if (apikey !== this.config.clientApiKey) {
      throw new UnauthorizedException('Invalid api key');
    }

    return true;
  }
}
