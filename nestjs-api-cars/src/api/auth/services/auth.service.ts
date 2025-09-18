import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseService } from '@/common';
import { UsersService } from '@/api/users/services';
import { User } from '@/api/users/entities';
import { ConfigService } from '@nestjs/config';

/**
 * Service responsible for authentication-related operations
 */
@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authDataSource: DataSource,
  ) {
    super(authDataSource);
  }

  /**
   * Validate a user's email and password.
   * @param email The user's email address
   * @param password The user's plaintext password
   * @returns The sanitized user object if credentials are valid, otherwise null
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneUser(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.usersService.sanitizeUser(user);
    }
    return null;
  }

  /**
   * Generate a JWT access token for the authenticated user.
   * @param user The user object to generate the token for
   * @returns An object containing the user data and JWT access token
   */
  login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      }),
    };
  }
}
