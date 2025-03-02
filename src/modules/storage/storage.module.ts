import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { SupabaseModule } from 'src/utils/supabase/supabase.module';
import { StorageController } from './controllers/storage.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
