import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { BaseService, PageDto, PageOptionsDto } from '@/common';
import { Order, OrderStatus } from '../entities';

import { User } from '@/api/users/entities';
import { Product } from '@/api/products/entities';
import { OrderItem } from '@/api/orderItems/entities';

import {
  CreateOrderDto,
  SearchOrdersOptionsDto,
  UpdateOrderDto,
} from '../dtos';

@Injectable()
export class OrdersService extends BaseService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly ordersDatasource: DataSource,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super(ordersDatasource);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    searchOrdersOptionsDto: SearchOrdersOptionsDto,
  ): Promise<PageDto<Order[]>> {
    const model = 'orders';

    const queryBuilder = this.orderRepository
      .createQueryBuilder(model)
      .leftJoinAndSelect(`${model}.user`, 'user')
      .leftJoinAndSelect(`${model}.items`, 'items')
      .leftJoinAndSelect(`items.product`, 'product')
      .select([
        `${model}.id`,
        `${model}.status`,
        `${model}.total`,
        `${model}.createdAt`,
        `${model}.updatedAt`,
        `user.id`,
        `user.firstName`,
        `user.lastName`,
        `items.id`,
        `items.quantity`,
        `items.price`,
        `product.id`,
        `product.name`,
      ]);

    const searchKeys = Object.keys(
      searchOrdersOptionsDto,
    ) as (keyof SearchOrdersOptionsDto)[];

    for (const key of searchKeys) {
      const value = searchOrdersOptionsDto[key];
      if (value === undefined || value === '' || value === null) {
        continue;
      }

      if (key === 'status') {
        queryBuilder.andWhere(`${model}.status = :status`, { status: value });
      }

      if (key === 'userId') {
        queryBuilder.andWhere(`user.id = :userId`, { userId: value });
      }

      if (key === 'fromDate') {
        queryBuilder.andWhere(`${model}.createdAt >= :fromDate`, {
          fromDate: value,
        });
      }
      if (key === 'toDate') {
        queryBuilder.andWhere(`${model}.createdAt <= :toDate`, {
          toDate: value,
        });
      }
    }

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      model,
      pageOptionsDto,
    );
  }

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.userId },
    });
    if (!user)
      throw new NotFoundException(
        `User with id ${createOrderDto.userId} not found`,
      );

    const order = this.orderRepository.create({
      user,
      status: OrderStatus.PENDING,
      total: 0,
    });
    await this.orderRepository.save(order);

    let total = 0;
    const items: OrderItem[] = [];

    for (const itemDto of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: itemDto.productId },
      });
      if (!product)
        throw new NotFoundException(
          `Product with id ${itemDto.productId} not found`,
        );

      if (product.stock < itemDto.quantity) {
        throw new NotFoundException(
          `Not enough stock for product ${product.name}`,
        );
      }

      const orderItem = this.orderItemRepository.create({
        order,
        product,
        quantity: itemDto.quantity,
        price: product.price,
      });

      total += product.price * itemDto.quantity;
      items.push(orderItem);

      product.stock -= itemDto.quantity;
      await this.productRepository.save(product);
    }

    await this.orderItemRepository.save(items);

    order.total = total;
    await this.orderRepository.save(order);

    await this.cacheManager.del(`orders:user:${user.id}`);

    return {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        priceUnit: i.price,
        subtotal: i.price * i.quantity,
      })),
    };
  }

  async findOne(id: string) {
    const cacheKey = `order:${id}`;
    const cached = await this.cacheManager.get<Order>(cacheKey);
    if (cached) {
      return cached;
    }

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    await this.cacheManager.set(cacheKey, order, 60 * 1000);
    return order;
  }

  async findByUser(userId: string) {
    const cacheKey = `orders:user:${userId}`;
    const cached = await this.cacheManager.get<Order[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
    });

    await this.cacheManager.set(cacheKey, orders, 60 * 1000);
    return orders;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({ id, ...updateOrderDto });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    const saved = await this.orderRepository.save(order);

    await this.cacheManager.del(`order:${id}`);
    if (order.user?.id) {
      await this.cacheManager.del(`orders:user:${order.user.id}`);
    }

    return saved;
  }
}
