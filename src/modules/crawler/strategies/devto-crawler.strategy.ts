import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';

import { ArticleData, CrawlerStrategy } from '../interfaces';

@Injectable()
export class DevToCrawlerStrategy implements CrawlerStrategy {
  getSupportedDomains(): string[] {
    return ['dev.to'];
  }

  async crawlArticle(url: string): Promise<ArticleData> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = load(response.data);

      const title = $('.crayons-article__header__meta h1')
        .first()
        .text()
        .trim();

      const contentHtml =
        $('.crayons-article__main .crayons-article__body').first().html() || '';
      const content = this.cleanContent(contentHtml);

      return {
        title,
        content: content,
      };
    } catch (error) {
      throw new Error(`Failed to crawl dev.to article: ${error.message}`);
    }
  }

  private cleanContent(htmlContent: string): string {
    if (!htmlContent) return '';

    const $ = load(htmlContent);

    $(
      'script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .highlight__panel',
    ).remove();

    $('*').each((_, element) => {
      if ('tagName' in element) {
        const $el = $(element);
        const tagName = element.tagName;
        const innerHTML = $el.html();

        $el.replaceWith(`<${tagName}>${innerHTML}</${tagName}>`);
      }
    });

    const cleanHtml = $.html();

    return cleanHtml
      .replace(/[\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\\"/g, '"')
      .trim();
  }
}
