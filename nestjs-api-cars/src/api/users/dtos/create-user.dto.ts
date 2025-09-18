import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '../entities/user.entity';

/**
 * DTO for creating a new user.
 */
export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password, minimum 6 characters' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'User role (admin or client)',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be either admin or client' })
  role?: UserRole;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Phone number with 7 to 15 digits',
    example: '1234567890',
  })
  @IsOptional()
  @Matches(/^[0-9]{7,15}$/, {
    message: 'phone must be a valid number with 7 to 15 digits',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'User address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'User city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'User country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Is the user active?', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
