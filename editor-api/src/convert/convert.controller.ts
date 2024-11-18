import { Controller, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('convert')
@UseGuards(ApiKeyGuard)
export class ConvertController {
  constructor(private readonly service: ConvertService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async create(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const zipBuffer = await this.service.convert(file);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="output.zip"',
      'Content-Length': zipBuffer.length,
    });
    res.end(zipBuffer);
  }
}
