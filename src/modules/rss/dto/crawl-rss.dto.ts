import { ArrayNotEmpty, IsArray, IsUrl } from 'class-validator';

export class CrawlSingleFeedDto {
  @IsUrl({}, { message: 'Invalid URL format' })
  url!: string;
}

export class CrawlBatchFeedsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true, message: 'Each URL must be valid' })
  urls!: string[];
}
