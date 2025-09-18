import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services';
import {
  CreateProductDto,
  SearchProductsOptionsDto,
  UpdateProductDto,
} from '../dtos';

import { JwtAuthGuard } from '@/api/auth/guard';
import { Roles } from '@/common/decorators';
import { PageDto, PageOptionsDto } from '@/common';
import { Product } from '../entities';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Create a new product
   * @param createProductDto Product data to create
   * @returns The newly created product
   */
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * Retrieve a paginated list of products
   * @param pageOptionsDto Pagination options
   * @param searchProductsOptionsDto Filter options for searching products
   * @returns A paginated list of products
   */
  @Get()
  @ApiOperation({
    summary: 'Get all products with optional filters and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [Product],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchProductsOptionsDto: SearchProductsOptionsDto,
  ): Promise<PageDto<Product[]>> {
    return await this.productsService.findAll(
      pageOptionsDto,
      searchProductsOptionsDto,
    );
  }

  /**
   * Retrieve a single product by ID
   * @param id Product UUID
   * @returns The requested product
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * Update a product by ID
   * @param id Product UUID
   * @param updateProductDto Data to update
   * @returns The updated product
   */
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Delete a product by ID
   * @param id Product UUID
   * @returns The deleted product
   */
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
