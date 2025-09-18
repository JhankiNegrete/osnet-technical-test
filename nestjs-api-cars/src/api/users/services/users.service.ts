import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BaseService, PageDto, PageOptionsDto } from '@/common';

import {
  CreateUserDto,
  SearchUsersOptionsDto,
  UpdateUserDto,
} from '../../users/dtos';

import { User } from '../../users/entities';
import { UserRole } from '../entities/user.entity';

import { encodePassword } from '@/utils';
import { validate as isUUID } from 'uuid';

/**
 * Service for managing user-related operations.
 */
@Injectable()
export class UsersService extends BaseService {
  /**
   * Creates an instance of UsersService.
   * @param userRepository The repository for user entities.
   * @param userDataSource The data source for user entities.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userDataSource: DataSource,

    private readonly configService: ConfigService,
  ) {
    super(userDataSource);
  }

  /**
   * Creates a new user with the provided data.
   * @param createUserDto The data for creating a new user.
   * @returns The created user.
   * @throws BadRequestException if password is empty and not generated randomly.
   */
  async create(createUserDto: CreateUserDto) {
    const { password, role, ...userData } = createUserDto;

    if (!password) {
      throw new BadRequestException('Password cannot be empty');
    }

    const user = this.userRepository.create({
      ...userData,
      password: encodePassword(password),
      role: role ?? UserRole.CLIENT,
    });

    let savedUser: User | undefined = undefined;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (error) {
      this.handleDbExceptions(error);
    }
    if (savedUser && savedUser.password) {
      return this.sanitizeUser(savedUser);
    }

    return savedUser;
  }

  /**
   * Finds all users based on pagination and search options.
   * @param pageOptionsDto Pagination options.
   * @param searchUsersOptionsDto Search options.
   * @returns Paginated list of users.
   */
  async findAll(
    pageOptionsDto: PageOptionsDto,
    searchUsersOptionsDto: SearchUsersOptionsDto,
  ): Promise<PageDto<User[]>> {
    const model = 'users';

    const queryBuilder = this.userRepository
      .createQueryBuilder(model)
      .select([
        `${model}.id`,
        `${model}.email`,
        `${model}.firstName`,
        `${model}.lastName`,
        `${model}.role`,
        `${model}.phone`,
        `${model}.address`,
        `${model}.city`,
        `${model}.country`,
        `${model}.createdAt`,
        `${model}.updatedAt`,
      ]);

    const searchKeys = Object.keys(
      searchUsersOptionsDto,
    ) as (keyof SearchUsersOptionsDto)[];

    for (const key of searchKeys) {
      const value = searchUsersOptionsDto[key];

      if (value === undefined || value === '' || value === null) {
        continue;
      }
      queryBuilder.where(`LOWER(${model}.${key}) like :${key}`, {
        [key]: `%${value.toLowerCase()}%`,
      });
    }

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      model,
      pageOptionsDto,
    );
  }

  /**
   * Finds a user by ID or username/email.
   * @param term ID, username, or email of the user.
   * @param deletePass Whether to delete the user's password from the response.
   * @returns The found user.
   * @throws NotFoundException if the user is not found.
   */
  async findOne(term: string, deletePass = true) {
    this.handleValideTerm('Users', term);
    const user = await this.findOneUser(term);

    if (!user) throw new NotFoundException(`User with term ${term} not found`);

    if (user.password && deletePass) {
      return this.sanitizeUser(user);
    }

    return user;
  }

  /**
   * Updates an existing user with the provided data.
   * @param id The ID of the user to update.
   * @param updateUserDto The data to update the user.
   * @returns The updated user.
   * @throws NotFoundException if the user is not found.
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    let newPassword = user.password;
    if (updateUserDto.password) {
      newPassword = encodePassword(updateUserDto.password);
    }

    const preloadUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
      password: newPassword,
    });

    if (!preloadUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const savedUser = await this.userRepository.save(preloadUser);

    return this.sanitizeUser(savedUser);
  }

  async findOneUser(term: string): Promise<User | null> {
    const model = 'user';
    let user: User | null = null;

    const queryBuilder = this.userRepository
      .createQueryBuilder(model)
      .select([
        `${model}.id`,
        `${model}.email`,
        `${model}.firstName`,
        `${model}.lastName`,
        `${model}.password`,
        `${model}.role`,
        `${model}.phone`,
        `${model}.address`,
        `${model}.city`,
        `${model}.country`,
        `${model}.isActive`,
        `${model}.createdAt`,
        `${model}.updatedAt`,
      ]);

    try {
      if (isUUID(term)) {
        user = await queryBuilder
          .where(`${model}.id =:id `, {
            id: term,
          })
          .getOne();
      } else {
        user = await queryBuilder
          .where(`LOWER(user.email) =:email `, {
            email: term?.toLowerCase(),
          })
          .getOne();
      }
    } catch (error) {
      this.handleDbExceptions(error);
    }

    return user;
  }

  /**
   * Removes a user by ID, including associated sessions and profile.
   * @param id The ID of the user to remove.
   * @returns A success message upon successful removal.
   * @throws NotFoundException if the user is not found.
   */
  async remove(id: string) {
    this.handleValideUUID('Users', id);

    const user = await this.findOneUser(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      await this.userRepository.remove(user);
      return { message: `User ${user.email} removed successfully` };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  sanitizeUser(user: User): Omit<User, 'password'> {
    const { password: _pw, ...userWithoutPassword } = user;
    void _pw;
    return userWithoutPassword;
  }
}
