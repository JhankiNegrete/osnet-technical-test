import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Product } from '../entities';
import {
  CreateProductDto,
  SearchProductsOptionsDto,
  UpdateProductDto,
} from '../dtos';
import { BaseService, PageDto, PageOptionsDto } from '@/common';

@Injectable()
export class ProductsService extends BaseService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productDatasource: DataSource,
  ) {
    super(productDatasource);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    searchProductsOptionsDto: SearchProductsOptionsDto,
  ): Promise<PageDto<Product[]>> {
    const model = 'products';

    const queryBuilder = this.productRepository
      .createQueryBuilder(model)
      .select([model]);

    const searchKeys = Object.keys(
      searchProductsOptionsDto,
    ) as (keyof SearchProductsOptionsDto)[];

    for (const key of searchKeys) {
      const value = searchProductsOptionsDto[key];

      if (value === undefined || value === '' || value === null) {
        continue;
      }

      if (key === 'isActive') {
        queryBuilder.andWhere(`${model}.isActive = :isActive`, {
          isActive: value === 'true',
        });
      } else {
        queryBuilder.andWhere(`LOWER(${model}.${key}) like :${key}`, {
          [key]: `%${value.toLowerCase()}%`,
        });
      }
    }

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      model,
      pageOptionsDto,
    );
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<string> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `Product ${product.name} deleted successfully`;
  }
}
