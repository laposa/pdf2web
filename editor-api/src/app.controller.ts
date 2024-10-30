import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/status')
  getStatus(): { msg: 'ok' } {
    return { msg: 'ok' };
  }
}
