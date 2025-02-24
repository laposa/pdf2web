import { IsNumberString, IsOptional } from 'class-validator';

export class ConvertDto {
  @IsOptional()
  @IsNumberString()
  quality?: string;
}
