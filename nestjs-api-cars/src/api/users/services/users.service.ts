import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BaseService } from '@/common';

import { CreateUserDto } from '../../users/dtos';

import { User } from '../../users/entities';
import { UserRole } from '../entities/user.entity';

import { encodePassword } from '@/utils';

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
      password: encodePassword(password) as string,
      role: role ?? UserRole.CLIENT,
    });

    let savedUser: User | undefined = undefined;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (error) {
      this.handleDbExceptions(error);
    }
    if (savedUser && savedUser.password) {
      const { password: _pw, ...userWithoutPassword } = savedUser;
      void _pw;
      return userWithoutPassword;
    }

    return savedUser;
  }
}
