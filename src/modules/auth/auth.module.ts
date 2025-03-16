import { AuthorModule } from '@modules/authors/author.module';
import { Module } from '@nestjs/common';
import { SupabaseModule } from '@utils/supabase/supabase.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [AuthorModule, SupabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
