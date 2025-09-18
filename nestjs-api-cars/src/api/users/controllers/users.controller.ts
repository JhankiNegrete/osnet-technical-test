import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { PageDto, PageOptionsDto } from '@/common';
import { CreateUserDto, SearchUsersOptionsDto, UpdateUserDto } from '../dtos';
import { UsersService } from '../services';
import { User } from '../entities';

import { Roles } from '@/common/decorators';
import { JwtAuthGuard } from '@/api/auth/guard';
import { OwnershipGuard, RolesGuard } from '@/common/guards';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param createUserDto - DTO containing user data.
   * @returns The created user.
   */
  @Post()
  @Roles('admin', 'client')
  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get a paginated list of users with optional search filters.
   * @param pageOptionsDto - Pagination options (page, limit, etc.)
   * @param searchUsersOptionsDto - Optional search filters (name, email, role, etc.)
   * @returns Paginated list of users.
   */
  @SkipThrottle()
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchUsersOptionsDto: SearchUsersOptionsDto,
  ): Promise<PageDto<User[]>> {
    return await this.usersService.findAll(
      pageOptionsDto,
      searchUsersOptionsDto,
    );
  }

  /**
   * Get a single user by ID.
   * @param id - User ID.
   * @returns The found user.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Update a user by ID.
   * @param id - User ID.
   * @param updateUserDto - DTO containing updated user data.
   * @returns The updated user.
   */
  @Patch(':id')
  @Roles('admin', 'client')
  @UseGuards(OwnershipGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Remove a user by ID.
   * @param id - User ID.
   * @returns A message confirming deletion.
   */
  @Delete(':id')
  @Roles('admin', 'client')
  @UseGuards(OwnershipGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
