import { IsOptional, IsString, IsBooleanString } from 'class-validator';

export class SearchProductsOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
