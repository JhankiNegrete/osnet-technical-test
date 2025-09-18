import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '@/api/orders/entities';
import { Product } from '@/api/products/entities';

import { OrderItem } from './entities';
import { OrderItemsService } from './services';
import { OrderItemsController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product])],
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
