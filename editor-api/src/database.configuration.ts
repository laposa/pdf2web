import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(
    connectionName?: string
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: +process.env.DB_PORT ?? 5432,
      username: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASSWORD ?? "password",
      database: process.env.DB_NAME ?? "editor",
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
