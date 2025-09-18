import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '@/api/products/entities';

import { OrderItem } from './entities';
import { OrderItemsService } from './services';
import { OrderItemsController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Product])],
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
