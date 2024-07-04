import { IsString } from 'class-validator';

export class UpdatePublicationDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly author: string;
}
