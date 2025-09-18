import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the auto product',
    example: 'Filtro de aceite Bosch',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the auto product',
    example: 'Filtro de aceite compatible con motores 1.6L y 2.0L',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the auto product in USD',
    example: 25.5,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Available stock for the auto product',
    example: 150,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'Whether the auto product is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
