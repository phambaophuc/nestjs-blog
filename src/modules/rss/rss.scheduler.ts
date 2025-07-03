import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ArticleService } from '../articles';
import { CrawlerService } from '../crawler';
import { RssService } from './rss.service';
import { RssItem } from './types';

@Injectable()
export class RssScheduler {
  private readonly logger = new Logger(RssScheduler.name);
  private isRunning = false;
  private readonly FEED_URL = 'https://dev.to/feed';
  private readonly USER_ID = '4bb5e8a6-342e-4a98-9f12-cc5d0283bb85';

  constructor(
    private readonly rssService: RssService,
    private readonly articleService: ArticleService,
    private readonly crawlerService: CrawlerService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async crawlScheduledFeeds(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('⚠️ RSS crawl skipped: previous job still running.');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    this.logger.log(`⏳ Starting RSS crawl...`);

    try {
      const { items } = await this.rssService.crawlRssFeed(this.FEED_URL);

      if (!items?.length) {
        this.logger.warn('No items found in RSS feed.');
        return;
      }

      await this.processFeed(items);
      this.logger.log(`📊 Processed ${items.length} items from RSS feed.`);
    } catch (error) {
      this.logger.error(
        'Error in scheduled RSS crawl:',
        (error as Error).message,
      );
    } finally {
      this.logger.log(
        `✅ RSS crawl finished in ${(Date.now() - startTime) / 1000}s`,
      );
      this.isRunning = false;
    }
  }

  private async processFeed(items: RssItem[]) {
    await Promise.all(
      items.map(async (item) => {
        const { link } = item;
        const { title, content } = await this.crawlerService.crawlArticle(link);
        await this.articleService.createIfNotExists(
          {
            title,
            content,
          },
          this.USER_ID,
        );
      }),
    );
  }
}
