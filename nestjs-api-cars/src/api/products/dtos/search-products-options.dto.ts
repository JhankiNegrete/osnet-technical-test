import { IsOptional, IsString, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProductsOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter by name of the auto product',
    example: 'Filtro de aceite Bosch',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by description of the auto product',
    example: 'Compatible with engines 1.6L and 2.0L',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status (true or false)',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
