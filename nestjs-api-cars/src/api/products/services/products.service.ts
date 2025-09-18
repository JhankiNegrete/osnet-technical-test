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

  /**
   * Create a new product in the auto products store.
   * @param createProductDto - DTO containing product data.
   * @returns The created product.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Get a paginated list of products with optional search filters.
   * @param pageOptionsDto - Pagination options (page, limit, etc.)
   * @param searchProductsOptionsDto - Optional search filters (name, description, isActive)
   * @returns Paginated list of products.
   */
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

  /**
   * Find a product by its unique ID.
   * @param id - Product ID.
   * @throws NotFoundException if the product does not exist.
   * @returns The found product.
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  /**
   * Update an existing product by its ID.
   * @param id - Product ID.
   * @param updateProductDto - DTO containing updated product data.
   * @returns The updated product.
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Remove a product by its ID.
   * @param id - Product ID.
   * @returns A message confirming the deletion.
   */
  async remove(id: string): Promise<string> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `Product ${product.name} deleted successfully`;
  }
}
