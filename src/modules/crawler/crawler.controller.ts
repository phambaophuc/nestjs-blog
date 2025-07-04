import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CrawlerService } from './crawler.service';
import { ArticleData } from './interfaces';

@ApiTags('CrawlerController')
@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('crawl')
  @ApiOperation({ summary: 'Crawl article content from a URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://example.com/article' },
      },
      required: ['url'],
    },
  })
  async crawlArticle(@Body('url') url: string): Promise<ArticleData> {
    if (!url) {
      throw new Error('URL is required');
    }
    return this.crawlerService.crawlArticle(url);
  }

  @Get('supported-domains')
  @ApiOperation({ summary: 'Get list of supported domains for crawling' })
  getSupportedDomains(): string[] {
    return this.crawlerService.getSupportedDomains();
  }
}
