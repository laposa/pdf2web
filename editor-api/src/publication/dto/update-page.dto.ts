import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class PageAreaDto {
  @IsString()
  x: string;

  @IsString()
  y: string;

  @IsString()
  width: string;

  @IsString()
  height: string;

  @IsString()
  @IsOptional()
  tooltip?: string;

  @IsString()
  url: string;
}

export class UpdatePageDto {
  @IsString()
  readonly name: string;

  @ValidateNested()
  readonly areas_json: PageAreaDto[] | null;
}
