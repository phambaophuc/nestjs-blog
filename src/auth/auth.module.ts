import { UserModule } from '@modules/users';
import { Module } from '@nestjs/common';
import { SupabaseModule } from '@shared';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, SupabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
