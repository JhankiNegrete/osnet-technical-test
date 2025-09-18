import { IsUUID, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '@/api/orderItems/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsUUID()
  @ApiProperty({
    description: 'UUID of the user placing the order',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  userId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of order items',
    type: [CreateOrderItemDto],
    minItems: 1,
  })
  items: CreateOrderItemDto[];
}
