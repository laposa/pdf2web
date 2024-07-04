import { IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly author: string;
}
