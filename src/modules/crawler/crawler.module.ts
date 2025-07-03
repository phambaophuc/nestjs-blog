import { Module } from '@nestjs/common';

import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { DevToCrawlerStrategy } from './strategies';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, DevToCrawlerStrategy],
  exports: [CrawlerService],
})
export class CrawlerModule {}
