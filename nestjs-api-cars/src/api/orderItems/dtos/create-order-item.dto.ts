import { IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating an Order Item
 */
export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product to be added to the order',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product to add',
    minimum: 1,
    example: 2,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
