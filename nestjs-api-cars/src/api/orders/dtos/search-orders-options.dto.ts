import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities';

export class SearchOrdersOptionsDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotal?: number;
}
