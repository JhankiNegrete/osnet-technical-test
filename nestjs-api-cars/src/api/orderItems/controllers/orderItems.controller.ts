import { Controller, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { OrderItemsService } from '../services';
import { UpdateOrderItemDto } from '../dtos';
import { OrderItem } from '../entities';

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  /**
   * Get all order items.
   * @returns List of all order items.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all order items' })
  @ApiResponse({
    status: 200,
    description: 'List of order items',
    type: [OrderItem],
  })
  findAll() {
    return this.orderItemsService.findAll();
  }

  /**
   * Get a single order item by ID.
   * @param id Order item ID
   * @returns The order item
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single order item by ID' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'The order item', type: OrderItem })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(id);
  }

  /**
   * Update an order item by ID.
   * @param id Order item ID
   * @param dto Data to update the order item
   * @returns The updated order item
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item by ID' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiBody({ type: UpdateOrderItemDto })
  @ApiResponse({
    status: 200,
    description: 'The updated order item',
    type: OrderItem,
  })
  update(@Param('id') id: string, @Body() dto: UpdateOrderItemDto) {
    return this.orderItemsService.update(id, dto);
  }

  /**
   * Delete an order item by ID.
   * @param id Order item ID
   * @returns Success message or status
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item by ID' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(id);
  }
}
