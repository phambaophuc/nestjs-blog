import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ArticleModule } from '../articles';
import { CrawlerModule } from '../crawler';
import { RssController } from './rss.controller';
import { RssScheduler } from './rss.scheduler';
import { RssService } from './rss.service';

@Module({
  imports: [ScheduleModule.forRoot(), ArticleModule, CrawlerModule],
  providers: [RssService, RssScheduler],
  controllers: [RssController],
  exports: [RssService],
})
export class RssModule {}
