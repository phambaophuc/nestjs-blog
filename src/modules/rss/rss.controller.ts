import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CrawlBatchFeedsDto, CrawlSingleFeedDto } from './dto';
import { RssService } from './rss.service';
import { CrawlResult, RssFeed } from './types';

@ApiTags('RssController')
@Controller('rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Get('crawl')
  @ApiOperation({ summary: 'Crawl a single RSS feed' })
  @ApiQuery({
    name: 'url',
    required: true,
    type: String,
    description: 'RSS feed URL',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL or failed to crawl feed',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async crawlSingleFeed(@Query() query: CrawlSingleFeedDto): Promise<RssFeed> {
    try {
      return await this.rssService.crawlRssFeed(query.url);
    } catch (error) {
      throw new BadRequestException(
        `Failed to crawl RSS feed: ${(error as Error).message}`,
      );
    }
  }

  @Post('crawl-batch')
  @ApiOperation({ summary: 'Crawl multiple RSS feeds in batch' })
  @ApiBody({ type: CrawlBatchFeedsDto })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or crawling error',
  })
  @UsePipes(new ValidationPipe())
  async crawlBatchFeeds(
    @Body() body: CrawlBatchFeedsDto,
  ): Promise<CrawlResult[]> {
    return await this.rssService.crawlMultipleFeeds(body.urls);
  }
}
