import { PartialType } from "@nestjs/mapped-types";
import { CreatePublicationDto } from "src/publication/dto/create-publication.dto";

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {
  readonly name: string;
  readonly title: string;
  readonly author: string;
}
