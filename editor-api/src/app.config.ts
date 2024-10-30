import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV!,
  port: +process.env.PORT! || 3000,
  clientApiKey: process.env.CLIENT_API_KEY!,
  database: {
    host: process.env.DB_HOST!,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_SSL === 'true',
  },
}));

export const InjectConfig = () => Inject(appConfig.KEY);

export type AppConfig = ConfigType<typeof appConfig>;

export default appConfig;
