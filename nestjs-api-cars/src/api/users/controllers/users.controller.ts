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

import { CreateUserDto, SearchUsersOptionsDto, UpdateUserDto } from '../dtos';

import { PageDto, PageOptionsDto } from '@/common';
import { JwtAuthGuard } from '@/api/auth/guard';

import { UsersService } from '../services';
import { User } from '../entities';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves a paginated list of users based on search and page options.
   * @param pageOptionsDto Pagination options.
   * @param searchOptionsDto Search options.
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Removes a user by ID.
   * @param id - The ID of the user to remove.
   * @returns A success message upon successful removal.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if attempting to delete a special user.
   */
  @Delete(':id')
  // @Auth([ValidServices.Security], [ValidAccess.Delete])
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
