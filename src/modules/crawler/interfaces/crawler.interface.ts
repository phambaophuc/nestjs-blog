export interface CrawlerStrategy {
  crawlArticle(url: string): Promise<ArticleData>;
  getSupportedDomains(): string[];
}

export interface ArticleData {
  title: string;
  content: string;
}
