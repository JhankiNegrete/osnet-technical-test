import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';
import { User } from '../users/entities';
import { Product } from '../products/entities';
import { OrderItem } from '../orderItems/entities';

import { OrdersService } from './services';
import { OrdersController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
