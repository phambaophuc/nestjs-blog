export interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  guid?: string;
  author?: string;
  categories?: string[];
  content?: string;
}

export interface RssFeed {
  title: string;
  description: string;
  link: string;
  items: RssItem[];
  lastBuildDate?: Date;
}

export interface CrawlResult {
  url: string;
  feed?: RssFeed;
  error?: string;
}

// XML structure interfaces
export interface XmlTextNode {
  '#text'?: string;
}

export interface XmlAttribute {
  '@_href'?: string;
  '@_rel'?: string;
}

export interface AtomLink extends XmlAttribute {
  '@_href': string;
}

export interface RssCategory extends XmlTextNode {
  '@_domain'?: string;
}

export interface RssGuid extends XmlTextNode {
  '@_isPermaLink'?: boolean;
}

export interface RssChannelItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  guid?: string | RssGuid;
  author?: string;
  'dc:creator'?: string;
  category?: string | string[] | RssCategory | RssCategory[];
  'content:encoded'?: string;
}

export interface RssChannel {
  title?: string;
  description?: string;
  link?: string;
  lastBuildDate?: string;
  item?: RssChannelItem | RssChannelItem[];
}

export interface RssRoot {
  rss?: {
    channel: RssChannel;
  };
}

export interface AtomEntry {
  title?: string | XmlTextNode;
  summary?: string | XmlTextNode;
  content?: string | XmlTextNode;
  link?: AtomLink | AtomLink[];
  published?: string;
  updated?: string;
  id?: string;
  author?: {
    name?: string;
    email?: string;
  };
  category?:
    | {
        '@_term'?: string;
        '@_label'?: string;
      }
    | Array<{
        '@_term'?: string;
        '@_label'?: string;
      }>;
}

export interface AtomFeed {
  title?: string | XmlTextNode;
  subtitle?: string | XmlTextNode;
  link?: AtomLink | AtomLink[];
  updated?: string;
  entry?: AtomEntry | AtomEntry[];
}

export interface AtomRoot {
  feed?: AtomFeed;
}

export type ParsedXmlData = RssRoot & AtomRoot;
