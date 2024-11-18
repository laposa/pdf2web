import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { ConvertModule } from './convert/convert.module';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    CommonModule,
    ConvertModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
