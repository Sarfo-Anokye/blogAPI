import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [LocalStrategy,AuthService],
  imports: [UsersModule,PassportModule]
})
export class AuthModule {}
