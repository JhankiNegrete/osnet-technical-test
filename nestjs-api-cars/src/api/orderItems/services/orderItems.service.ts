import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from '../entities';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos';

import { Order } from '@/api/orders/entities';
import { Product } from '@/api/products/entities';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(order: Order, dto: CreateOrderItemDto): Promise<OrderItem> {
    const product = await this.productsRepo.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Not enough stock for ${product.name}`);
    }

    const item = this.orderItemsRepo.create({
      order,
      product,
      quantity: dto.quantity,
      price: product.price,
    });

    return this.orderItemsRepo.save(item);
  }

  findAll() {
    return this.orderItemsRepo.find({ relations: ['order', 'product'] });
  }

  async findOne(id: string): Promise<OrderItem> {
    const item = await this.orderItemsRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!item) throw new NotFoundException('Order item not found');
    return item;
  }

  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.orderItemsRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.orderItemsRepo.remove(item);
  }
}
