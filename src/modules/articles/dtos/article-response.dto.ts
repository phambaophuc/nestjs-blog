import { CommentResponseDto } from '@modules/comments/dtos/comment-response.dto';
import { TagResponseDto } from '@modules/tags/dtos/tag-response.dto';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

import { ArticleEntity } from '../entities/article.entity';

export class ArticleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  views: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: () => TagResponseDto })
  tag: TagResponseDto;

  @ApiProperty({ type: () => [CommentResponseDto], nullable: true })
  comments?: CommentResponseDto[];

  static fromEntity(article: ArticleEntity): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      imageUrl: article.imageUrl,
      views: article.views,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      user: UserResponseDto.fromEntity(article.user),
      tag: TagResponseDto.fromEntity(article.tag),
      comments: article.comments
        ? CommentResponseDto.fromEntities(article.comments)
        : [],
    };
  }

  static fromEntities(articles: ArticleEntity[]): ArticleResponseDto[] {
    return articles.map((article) => ArticleResponseDto.fromEntity(article));
  }
}

export class GetArticlesResponseDto {
  @ApiProperty({ type: () => [ArticleResponseDto] })
  data: ArticleResponseDto[];

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 4 })
  totalPages: number;
}
