import { IsOptional, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  @IsOptional()
  readonly title: string;
}
