import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV!,
  port: +process.env.PORT! || 3000,
  clientApiKey: process.env.CLIENT_API_KEY!,
  convertDefaultQuality: +process.env.CONVERT_DEFAULT_QUALITY! || 0.8,
  maxHeight: +process.env.MAX_CONVERTED_IMAGE_HEIGHT! || 0,
}));

export const InjectConfig = () => Inject(appConfig.KEY);

export type AppConfig = ConfigType<typeof appConfig>;

export default appConfig;
