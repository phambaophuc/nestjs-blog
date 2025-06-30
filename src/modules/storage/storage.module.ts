import { Module } from '@nestjs/common';

import { SupabaseModule } from '@/shared';

import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [SupabaseModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
