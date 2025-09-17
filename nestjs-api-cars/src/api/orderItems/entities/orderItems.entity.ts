import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Order } from '@/api/orders/entities';
import { Product } from '@/api/products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
