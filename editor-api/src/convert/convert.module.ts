import { Module } from '@nestjs/common';
import { ConvertController } from './convert.controller';
import { ConvertService } from './convert.service';

@Module({
  controllers: [ConvertController],
  providers: [ConvertService]
})
export class ConvertModule {}
