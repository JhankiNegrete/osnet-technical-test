import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchOrdersOptionsDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({
    description: 'Filter orders by status',
    enum: OrderStatus,
  })
  status?: OrderStatus;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filter orders by user UUID',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  userId?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Filter orders from this date (ISO string)',
    example: '2025-09-17T00:00:00Z',
  })
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Filter orders up to this date (ISO string)',
    example: '2025-09-18T23:59:59Z',
  })
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Filter orders with a minimum total',
    example: 100,
  })
  minTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Filter orders with a maximum total',
    example: 1000,
  })
  maxTotal?: number;
}
