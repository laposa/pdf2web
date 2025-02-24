import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppLoggerService } from './common/utils/app-logger.service';
import { AppModule } from './app.module';
import { AppFilter } from './common/filters/app.filter';
import appConfig from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLoggerService(),
  });

  const config = app.get(appConfig.KEY);
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Authorization, Cache-Control, Content-Type',
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(helmet());

  app.useGlobalFilters(new AppFilter());
  const logger = app.get(AppLoggerService);
  await app.listen(config.port, () => {
    logger.log(`Started listening on ${config.port}`, 'NestApplication');
  });
}
bootstrap();
