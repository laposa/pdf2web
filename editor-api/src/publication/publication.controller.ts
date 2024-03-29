import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
} from "@nestjs/common";
import { PublicationService } from "./publication.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "src/publication/dto/update-publication.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdatePageDto } from "src/publication/dto/update-page.dto";

@Controller("publication")
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  create(
    @Body() CreatePublicationDto: CreatePublicationDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    // TODO: add file validation
    return this.publicationService.create(CreatePublicationDto, file);
  }

  @Get()
  findAll() {
    return this.publicationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.publicationService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePublicationDto: UpdatePublicationDto
  ) {
    return this.publicationService.update(+id, updatePublicationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.publicationService.remove(+id);
  }

  @Put(":id/page/:pageId")
  updatePage(
    @Param("id") id: string,
    @Param("pageId") pageId: string,
    @Body() updatePageDto: UpdatePageDto
  ) {
    return this.publicationService.updatePage(+id, +pageId, updatePageDto);
  }
}
