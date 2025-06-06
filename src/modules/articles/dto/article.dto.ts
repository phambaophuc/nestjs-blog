import { PaginatedResponseDto } from '@common/dto';
import { CommentResponseDto } from '@modules/comments/dto/comment.dto';
import { TagResponseDto } from '@modules/tags/dto/tag.dto';
import { UserResponseDto } from '@modules/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleEntity } from 'entities';

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
  user?: UserResponseDto;

  @ApiProperty({ type: () => TagResponseDto })
  tag?: TagResponseDto;

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
      user: article.user ? UserResponseDto.fromEntity(article.user) : undefined,
      tag: article.tag ? TagResponseDto.fromEntity(article.tag) : undefined,
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
