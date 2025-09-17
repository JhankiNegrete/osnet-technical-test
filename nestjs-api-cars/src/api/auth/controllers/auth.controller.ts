import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services';
import { User } from '@/api/users/entities';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user as User);
  }
}
