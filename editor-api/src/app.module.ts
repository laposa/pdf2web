import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicationModule } from "src/publication/publication.module";

@Module({
  imports: [
    PublicationModule,
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
