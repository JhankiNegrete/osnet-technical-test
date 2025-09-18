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
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  /**
   * Creates a new OrderItem for a given order.
   * @param order The order entity to associate the item with.
   * @param dto The data transfer object containing productId and quantity.
   * @returns The saved OrderItem entity.
   * @throws NotFoundException if the product does not exist.
   * @throws BadRequestException if there is not enough stock.
   */
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

  /**
   * Returns all order items with their related order and product.
   * @returns Array of OrderItem entities.
   */
  findAll() {
    return this.orderItemsRepo.find({ relations: ['order', 'product'] });
  }

  /**
   * Returns a single OrderItem by its ID.
   * @param id The ID of the OrderItem.
   * @returns The OrderItem entity.
   * @throws NotFoundException if the item does not exist.
   */
  async findOne(id: string): Promise<OrderItem> {
    const item = await this.orderItemsRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!item) throw new NotFoundException('Order item not found');
    return item;
  }

  /**
   * Updates an existing OrderItem by its ID.
   * @param id The ID of the OrderItem.
   * @param dto The data to update (partial).
   * @returns The updated OrderItem entity.
   */
  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.orderItemsRepo.save(item);
  }

  /**
   * Removes an OrderItem by its ID.
   * @param id The ID of the OrderItem to remove.
   * @returns void
   * @throws NotFoundException if the item does not exist.
   */
  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.orderItemsRepo.remove(item);
  }
}
