import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { CommentDetailDto } from '@/modules/comments/dto';
import { UserDetailDto } from '@/modules/users';

class ArticleBaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  createdAt: Date;
}

export class ArticleDetailDto extends ArticleBaseDto {
  @ApiPropertyOptional()
  excerpt?: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  coverImageUrl?: string;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  readingTime: number;

  @ApiProperty()
  tags: string[];

  @ApiPropertyOptional({ type: () => UserDetailDto })
  author?: UserDetailDto;

  @ApiPropertyOptional({ type: () => [CommentDetailDto] })
  comments?: CommentDetailDto[];
}

export class ArticleListDto extends ArticleBaseDto {
  @ApiPropertyOptional()
  excerpt?: string;

  @ApiPropertyOptional()
  coverImageUrl?: string;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  readingTime: number;

  @ApiProperty()
  tags: string[];

  @ApiPropertyOptional({ type: () => UserDetailDto })
  author?: UserDetailDto;
}

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  content: string;
}

export class QueryArticleDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
