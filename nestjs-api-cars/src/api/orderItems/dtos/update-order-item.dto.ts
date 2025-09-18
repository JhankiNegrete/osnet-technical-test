import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';

/**
 * DTO for updating an Order Item
 * All fields are optional and documented in Swagger via PartialType
 */
export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
