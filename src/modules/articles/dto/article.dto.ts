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

  @ApiProperty({ nullable: true })
  @IsOptional()
  excerpt?: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  coverImageUrl?: string;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  author?: UserResponseDto;

  @ApiProperty({ type: () => [CommentResponseDto], nullable: true })
  comments?: CommentResponseDto[];

  static fromEntity(article: ArticleEntity): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      coverImageUrl: article.coverImageUrl,
      viewsCount: article.viewsCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
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
