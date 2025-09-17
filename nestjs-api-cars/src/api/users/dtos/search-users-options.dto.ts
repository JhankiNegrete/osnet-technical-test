import { IsOptional, IsUUID, IsString } from 'class-validator';

export class SearchUsersOptionsDto {
  @IsUUID(4, { message: 'The Organization ID is not UUID' })
  @IsOptional()
  readonly organization?: string | null = null;

  @IsOptional()
  @IsString()
  readonly userName?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
