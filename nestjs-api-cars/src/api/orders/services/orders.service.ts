import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities';
import { User } from '@/api/users/entities';
import { Product } from '@/api/products/entities';
import { OrderItem } from '@/api/orderItems/entities';
import { CreateOrderDto, UpdateOrderDto } from '../dtos';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.userId },
    });
    if (!user)
      throw new NotFoundException(
        `User with id ${createOrderDto.userId} not found`,
      );

    const items: OrderItem[] = [];

    let total = 0;
    for (const itemDto of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: itemDto.productId },
      });
      if (!product)
        throw new NotFoundException(
          `Product with id ${itemDto.productId} not found`,
        );

      const itemTotal = product.price * itemDto.quantity;
      total += itemTotal;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: itemDto.quantity,
        price: itemTotal,
      });
      items.push(orderItem);
    }

    const order = this.orderRepository.create({
      user,
      items,
      total,
    });

    return await this.orderRepository.save(order);
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async findByUser(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
    });
    return orders;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({ id, ...updateOrderDto });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return this.orderRepository.save(order);
  }
}
