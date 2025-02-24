import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ConvertDto } from './dtos/ConvertDto';

@Controller('convert')
@UseGuards(ApiKeyGuard)
export class ConvertController {
  constructor(private readonly service: ConvertService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async create(
    @Body() data: ConvertDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const zipBuffer = await this.service.convert(data, file);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="output.zip"',
      'Content-Length': zipBuffer.length,
    });
    res.end(zipBuffer);
  }
}
