import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities';
import { User } from '../users/entities';
import { Product } from '../products/entities';
import { OrderItem } from '../orderItems/entities';

import { OrdersService } from './services';
import { OrdersController } from './controllers';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, User]),
    PaymentsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
