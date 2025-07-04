import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUrl } from 'class-validator';

export class CrawlSingleFeedDto {
  @ApiProperty()
  @IsUrl({}, { message: 'Invalid URL format' })
  url!: string;
}

export class CrawlBatchFeedsDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true, message: 'Each URL must be valid' })
  urls!: string[];
}
