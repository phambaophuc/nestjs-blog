import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@/modules/users';
import { SupabaseModule } from '@/shared';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    SupabaseModule,
    JwtModule.register({
      secret: '5up3rS3cr3tAcc3ssK3y!2023@M1cr0s0ft#T3am',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
