import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PaginatedResponseDto } from '@/common';
import { ArticleEntity } from '@/entities';
import { CommentResponseDto } from '@/modules/comments/dto';
import { UserResponseDto } from '@/modules/users/dto';

export class ArticleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  excerpt?: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  readingTime: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  tags: string[];

  @ApiProperty({ type: () => UserResponseDto })
  @IsOptional()
  author?: UserResponseDto;

  @ApiProperty({ type: () => [CommentResponseDto] })
  comments: CommentResponseDto[];

  static fromEntity(article: ArticleEntity): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      coverImageUrl: article.coverImageUrl,
      viewsCount: article.viewsCount,
      readingTime: article.readingTime,
      createdAt: article.createdAt,
      tags: article.tags.map((tag) => tag.name),
      author: article.author
        ? UserResponseDto.fromEntity(article.author)
        : undefined,
      comments: article.comments
        ? CommentResponseDto.fromEntities(article.comments)
        : [],
    };
  }

  static fromEntities(articles: ArticleEntity[]): ArticleResponseDto[] {
    return articles.map((article) => ArticleResponseDto.fromEntity(article));
  }
}

export class GetArticlesResponseDto extends PaginatedResponseDto<ArticleResponseDto> {}
