import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthorModule } from '../authors/author.module';
import { SupabaseModule } from 'src/utils/supabase/supabase.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [AuthorModule, SupabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
