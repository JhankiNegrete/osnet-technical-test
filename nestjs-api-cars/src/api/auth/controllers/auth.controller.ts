import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { AuthService } from '../services';
import { User } from '@/api/users/entities';

/**
 * Controller responsible for authentication-related endpoints
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Authenticate a user with email and password.
   * @param body Object containing user's email and password
   * @returns Access token if credentials are valid
   * @throws UnauthorizedException if credentials are invalid
   */
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'strongPassword123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    schema: { example: { accessToken: 'jwt_token_here' } },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
