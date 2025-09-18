import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/api/auth/guard';
import { Roles } from '@/common/decorators';

import { OrdersService } from '../services/orders.service';

import {
  CreateOrderDto,
  SearchOrdersOptionsDto,
  UpdateOrderDto,
} from '../dtos';
import { SkipThrottle } from '@nestjs/throttler';
import { PageDto, PageOptionsDto } from '@/common';
import { Order } from '../entities';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Creates a new order.
   * @param createOrderDto DTO containing user ID and items.
   * @returns The created order with user info and items.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created.',
    type: Order,
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  /**
   * Returns paginated orders, optionally filtered by search options.
   * @param pageOptionsDto Pagination options.
   * @param searchOrdersOptionsDto Search filters like status, userId, date range.
   * @returns Paginated list of orders.
   */
  @SkipThrottle()
  @Get()
  @ApiOperation({
    summary: 'Get paginated orders with optional search filters',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiResponse({ status: 200, description: 'List of orders.', type: [Order] })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchOrdersOptionsDto: SearchOrdersOptionsDto,
  ): Promise<PageDto<Order[]>> {
    return await this.ordersService.findAll(
      pageOptionsDto,
      searchOrdersOptionsDto,
    );
  }

  /**
   * Retrieves an order by its ID.
   * @param id UUID of the order.
   * @returns The order entity.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order found.', type: Order })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  /**
   * Updates an order (admin only).
   * @param id UUID of the order to update.
   * @param updateOrderDto DTO with updated fields.
   * @returns The updated order entity.
   */
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update an order (admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order updated.', type: Order })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  /**
   * Retrieves all orders for a specific user.
   * @param userId UUID of the user.
   * @returns Array of orders for the user.
   */
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all orders for a specific user' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of user orders.',
    type: [Order],
  })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.ordersService.findByUser(userId);
  }
}
