import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { validate } from 'uuid';

import { PageOptionsDto, PageMetaDto, PageDto } from '../dtos';
import { Order, OrderBy } from '../constants';

@Injectable()
export abstract class BaseService {
  readonly logger = new Logger('BaseService');
  readonly isUUID = validate;

  /**
   * Constructor for the BaseService.
   * @param dataSource - The data source for the BaseService.
   */
  constructor(readonly dataSource: DataSource) {}

  /**
   * Executes a paginated query using the provided `SelectQueryBuilder`.
   *
   * @param queryBuilder - The `SelectQueryBuilder` for the query.
   * @param model - The model name for the query.
   * @param pageOptionsDto - The options for pagination.
   * @param rawProperties - Optional array of properties to include in the result set as raw data.
   *
   * @returns A `Promise` that resolves to a `PageDto` containing entities and metadata.
   *
   * @throws Will throw a `BadRequestException` if there's a database error related to duplicate entries or foreign key constraints.
   * @throws Will throw an `InternalServerErrorException` for unexpected database errors.
   */
  async queryBuilderPaginationExecute(
    queryBuilder: SelectQueryBuilder<any>,
    model: string,
    pageOptionsDto: PageOptionsDto,
  ) {
    const {
      take = 10,
      skip = 0,
      orderBy = OrderBy.NULL as string,
      order = Order.ASC as string,
    } = pageOptionsDto;

    queryBuilder
      .orderBy(
        `${model}.${orderBy === '' ? 'createdAt' : orderBy}`,
        order as Order,
      )
      .skip(skip)
      .take(take);

    try {
      const itemCount = await queryBuilder.getCount();
      const entities = await queryBuilder.getMany();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  /**
   * Execute a query for updating an entity.
   * @param entity - The entity to be updated.
   * @returns The updated entity.
   */
  async handleQueryExecute<T>(entity: T): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return entity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    }
  }

  async getCount(queryBuilder: SelectQueryBuilder<any>, model: string) {
    try {
      const total = await queryBuilder.getCount();

      const actives = await queryBuilder
        .where(`${model}.isActive = :isActive`, {
          isActive: true,
        })
        .getCount();

      const inactivates = await queryBuilder
        .where(`${model}.isActive = :isActive`, {
          isActive: false,
        })
        .getCount();

      return {
        total,
        actives,
        inactivates,
      };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  /**
   * Handle database exceptions and throw appropriate NestJS exceptions.
   * @param error - The database error to handle.
   * @throws {BadRequestException} - If a duplicate entry is detected.
   * @throws {BadRequestException} - If a foreign key constraint is violated.
   * @throws {InternalServerErrorException} - For unexpected database errors.
   */
  handleDbExceptions(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('users')) {
        if (error.sqlMessage.includes('@')) {
          throw new BadRequestException(
            'Error: This Email has already been used',
          );
        } else {
          throw new BadRequestException(
            'Error: This Username has already been used',
          );
        }
      }

      throw new BadRequestException(error.sqlMessage);
    }

    if (error.code === 'ER_ROW_IS_REFERENCED_2')
      throw new BadRequestException(error.sqlMessage);

    if (error.code === 'ER_SIGNAL_EXCEPTION') {
      throw new BadRequestException(error.sqlMessage);
    }

    this.logger.error(error);
    console.log(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  /**
   * Handle validation for the search term in find-one operations.
   * @param model - The model name for which the search is performed.
   * @param term - The search term.
   * @throws {BadRequestException} - If the search term is undefined.
   * @returns {boolean} - Always returns true if validation passes.
   */
  handleValideTerm(model: string, term: string) {
    if (!term)
      throw new BadRequestException(`Term to ${model} search is undefined`);

    return true;
  }

  /**
   * Handle validation for UUID in find-one operations.
   * @param model - The model name for which the ID is validated.
   * @param id - The ID to validate.
   * @throws {NotFoundException} - If the ID is not a valid UUID.
   * @returns {boolean} - Always returns true if validation passes.
   */
  handleValideUUID(model: string, id: string) {
    if (!this.isUUID(id))
      throw new NotFoundException(`${model} with id: ${id} not found`);

    return true;
  }
}
