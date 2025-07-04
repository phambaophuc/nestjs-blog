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
  private readonly FEED_URLS = ['https://dev.to/feed'];
  private readonly USER_ID = '4bb5e8a6-342e-4a98-9f12-cc5d0283bb85';

  constructor(
    private readonly rssService: RssService,
    private readonly articleService: ArticleService,
    private readonly crawlerService: CrawlerService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async crawlScheduledFeeds(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('⚠️ RSS crawl skipped: previous job still running.');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    this.logger.log(`⏳ Starting RSS crawl...`);

    try {
      const crawlResults = await this.rssService.crawlMultipleFeeds(
        this.FEED_URLS,
      );

      if (!crawlResults.length) {
        this.logger.warn('No items found in RSS feed.');
        return;
      }

      await Promise.all(
        crawlResults.map(async (result) => {
          const { feed } = result;
          if (feed) {
            await this.processFeed(feed.items);
            this.logger.log(
              `📊 Processed ${feed.items.length} items from ${feed.title || 'RSS feed'}.`,
            );
          }
        }),
      );
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

  private async processFeed(items: RssItem[]): Promise<void> {
    for (const item of items) {
      try {
        const { title, content } = await this.crawlerService.crawlArticle(
          item.link,
        );

        const isCreated = await this.articleService.createIfNotExists(
          { title, content },
          this.USER_ID,
        );

        if (!isCreated) {
          this.logger.debug(`Duplicate found at ${item.link}, stopping crawl.`);
          break;
        }

        this.logger.log(`Created article: ${item.link}`);
      } catch (error) {
        this.logger.warn(`Failed to process item: ${item.link}`, error.stack);
      }
    }
  }
}
