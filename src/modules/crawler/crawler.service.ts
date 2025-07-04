import { Injectable } from '@nestjs/common';

import { ArticleData, CrawlerStrategy } from './interfaces';
import { DevToCrawlerStrategy } from './strategies';

@Injectable()
export class CrawlerService {
  private strategies: Map<string, CrawlerStrategy> = new Map();

  constructor(private readonly devToCrawler: DevToCrawlerStrategy) {
    this.registerStrategy(devToCrawler);
  }

  private registerStrategy(strategy: CrawlerStrategy): void {
    const domains = strategy.getSupportedDomains();
    domains.forEach((domain) => {
      this.strategies.set(domain, strategy);
    });
  }

  async crawlArticle(url: string): Promise<ArticleData> {
    const domain = this.extractDomain(url);
    const strategy = this.strategies.get(domain);

    if (!strategy) {
      throw new Error(`No crawler strategy found for domain: ${domain}`);
    }

    return strategy.crawlArticle(url);
  }

  getSupportedDomains(): string[] {
    return Array.from(this.strategies.keys());
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
  }
}
