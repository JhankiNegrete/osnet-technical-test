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

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @SkipThrottle()
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchOrdersOptionsDto: SearchOrdersOptionsDto,
  ): Promise<PageDto<Order[]>> {
    return await this.ordersService.findAll(
      pageOptionsDto,
      searchOrdersOptionsDto,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Get('/user/:userId')
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.ordersService.findByUser(userId);
  }
}
