import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({
    description: 'The new status of the order',
    enum: OrderStatus,
    example: OrderStatus.COMPLETED,
  })
  status?: OrderStatus;
}
