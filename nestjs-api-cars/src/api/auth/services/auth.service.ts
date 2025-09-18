import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseService } from '@/common';

import { UsersService } from '@/api/users/services';
import { User } from '@/api/users/entities';
import { ConfigService } from '@nestjs/config';

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

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneUser(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.usersService.sanitizeUser(user);
    }
    return null;
  }

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
