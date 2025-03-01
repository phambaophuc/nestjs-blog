import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorModule } from '../authors/author.module';
import { SupabaseModule } from 'src/utils/supabase/supabase.module';

@Module({
  imports: [AuthorModule, SupabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
