import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers';
import { UsersService } from './services';
import { User } from './entities';

// import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    // RolesModule,
    // forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
