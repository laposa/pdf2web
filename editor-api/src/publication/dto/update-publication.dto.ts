import { IsString } from 'class-validator';

export class UpdatePublicationDto {
  @IsString()
  readonly title: string;
}
