import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { XMLParser } from 'fast-xml-parser';

import {
  AtomEntry,
  AtomFeed,
  AtomLink,
  CrawlResult,
  ParsedXmlData,
  RssCategory,
  RssChannel,
  RssChannelItem,
  RssFeed,
  RssGuid,
  RssItem,
  XmlTextNode,
} from './types';

@Injectable()
export class RssService {
  private readonly logger = new Logger(RssService.name);
  private readonly parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      parseTagValue: true,
      trimValues: true,
    });
  }

  async crawlRssFeed(url: string): Promise<RssFeed> {
    try {
      this.logger.log(`Crawling RSS feed: ${url}`);

      const response: AxiosResponse<string> = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'RSS-Crawler/1.0',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      });

      const parsedData = this.parser.parse(response.data) as ParsedXmlData;

      if (parsedData.rss?.channel) {
        return this.parseRss2(parsedData.rss.channel);
      }

      if (parsedData.feed) {
        return this.parseAtom(parsedData.feed);
      }

      throw new Error('Unsupported RSS format');
    } catch (error) {
      this.logger.error(
        `Failed to crawl RSS feed ${url}:`,
        (error as Error).message,
      );
      throw error;
    }
  }

  private parseRss2(channel: RssChannel): RssFeed {
    const items = this.normalizeToArray(channel.item);

    return {
      title: channel.title ?? '',
      description: channel.description ?? '',
      link: channel.link ?? '',
      lastBuildDate: channel.lastBuildDate
        ? new Date(channel.lastBuildDate)
        : undefined,
      items: items.map((item) => this.parseRssItem(item)),
    };
  }

  private parseAtom(feed: AtomFeed): RssFeed {
    const entries = this.normalizeToArray(feed.entry);

    return {
      title: this.extractTextContent(feed.title) ?? '',
      description: this.extractTextContent(feed.subtitle) ?? '',
      link: this.extractAtomLink(feed.link) ?? '',
      items: entries.map((entry) => this.parseAtomEntry(entry)),
    };
  }

  private parseRssItem(item: RssChannelItem): RssItem {
    return {
      title: item.title ?? '',
      description: item.description ?? '',
      link: item.link ?? '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      guid: this.extractGuid(item.guid) ?? item.link,
      author: item.author ?? item['dc:creator'],
      categories: this.extractRssCategories(item.category),
      content: item['content:encoded'] ?? item.description,
    };
  }

  private parseAtomEntry(entry: AtomEntry): RssItem {
    return {
      title: this.extractTextContent(entry.title) ?? '',
      description: this.extractTextContent(entry.summary) ?? '',
      link: this.extractAtomLink(entry.link) ?? '',
      pubDate: entry.published ? new Date(entry.published) : new Date(),
      guid: entry.id ?? '',
      author: entry.author?.name ?? '',
      content:
        this.extractTextContent(entry.content) ??
        this.extractTextContent(entry.summary) ??
        '',
      categories: this.extractAtomCategories(entry.category),
    };
  }

  private extractTextContent(
    content: string | XmlTextNode | undefined,
  ): string | undefined {
    if (!content) return undefined;

    if (typeof content === 'string') {
      return content;
    }

    return content['#text'];
  }

  private extractGuid(guid: string | RssGuid | undefined): string | undefined {
    if (!guid) return undefined;

    if (typeof guid === 'string') {
      return guid;
    }

    return guid['#text'];
  }

  private extractAtomLink(
    link: AtomLink | AtomLink[] | undefined,
  ): string | undefined {
    if (!link) return undefined;

    if (Array.isArray(link)) {
      const primaryLink = link.find(
        (l) => !l['@_rel'] || l['@_rel'] === 'alternate',
      );
      return primaryLink?.['@_href'] ?? link[0]?.['@_href'];
    }

    return link['@_href'];
  }

  private extractRssCategories(
    category: string | string[] | RssCategory | RssCategory[] | undefined,
  ): string[] {
    if (!category) return [];

    const categories = this.normalizeToArray(category);

    return categories
      .map((cat) => {
        if (typeof cat === 'string') {
          return cat;
        }
        return cat['#text'] ?? '';
      })
      .filter(Boolean);
  }

  private extractAtomCategories(
    category: AtomEntry['category'] | undefined,
  ): string[] {
    if (!category) return [];

    const categories = this.normalizeToArray(category);

    return categories
      .map((cat) => cat['@_label'] ?? cat['@_term'] ?? '')
      .filter(Boolean);
  }

  private normalizeToArray<T>(item: T | T[] | undefined): T[] {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  }

  async crawlMultipleFeeds(urls: string[]): Promise<CrawlResult[]> {
    const results = await Promise.allSettled(
      urls.map(async (url): Promise<CrawlResult> => {
        const feed = await this.crawlRssFeed(url);
        return { url, feed };
      }),
    );

    return results.map((result, index): CrawlResult => {
      if (result.status === 'fulfilled') {
        return result.value;
      }

      return {
        url: urls[index],
        error: (result.reason as Error).message,
      };
    });
  }
}
