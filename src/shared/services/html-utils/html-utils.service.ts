import { Injectable } from '@nestjs/common';

@Injectable()
export class HtmlUtilsService {
  extractFirstImage(html: string): string | null {
    const regex = /<img[^>]+src=["']?([^"'>\s]+)["']?/i;
    const match = html.match(regex);
    return match ? match[1] : null;
  }
}
