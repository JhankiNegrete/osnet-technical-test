import { IsOptional, IsUUID, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for filtering/searching users.
 */
export class SearchUsersOptionsDto {
  @ApiPropertyOptional({
    description: 'Organization ID to filter users by',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID(4, { message: 'The Organization ID is not UUID' })
  @IsOptional()
  readonly organization?: string | null = null;

  @ApiPropertyOptional({
    description: 'Filter by username',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString()
  readonly userName?: string;

  @ApiPropertyOptional({
    description: 'Filter by user email',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiPropertyOptional({
    description: 'Filter by user first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({
    description: 'Filter by user last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
