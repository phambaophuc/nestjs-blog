import { Module } from '@nestjs/common';
import { SupabaseModule } from '@utils/supabase/supabase.module';

import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';

@Module({
  imports: [SupabaseModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
