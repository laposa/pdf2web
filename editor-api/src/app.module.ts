import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicationModule } from "src/publication/publication.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    PublicationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "password",
      database: "flipbook",
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  //   controllers: [AppController],
  //   providers: [AppService],
})
export class AppModule {}
