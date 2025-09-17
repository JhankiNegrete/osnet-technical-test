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

  @Post()
  @Roles('admin', 'client')
  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

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
  @Roles('admin', 'client')
  @UseGuards(OwnershipGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin', 'client')
  @UseGuards(OwnershipGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
