import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationModule } from 'src/publication/publication.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfiguration } from 'src/database.configuration';
import { CommonModule } from './common/common.module';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),

    CommonModule,
    PublicationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
