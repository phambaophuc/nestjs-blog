import { ArticleEntity } from '@/entities';
import { CommentMapper } from '@/modules/comments/dto';
import { UserMapper } from '@/modules/users';

import { ArticleDetailDto, ArticleListDto } from './article.dto';

export class ArticleMapper {
  private static baseFields = (e: ArticleEntity) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    createdAt: e.createdAt,
  });

  private static extendedFields = (e: ArticleEntity) => ({
    ...this.baseFields(e),
    excerpt: e.excerpt,
    coverImageUrl: e.coverImageUrl,
    viewsCount: e.viewsCount,
    readingTime: e.readingTime,
    tags: e.tags?.map((t) => t.name) ?? [],
  });

  static toDetail = (e: ArticleEntity): ArticleDetailDto => ({
    ...this.extendedFields(e),
    content: e.content,
    author: e.author ? UserMapper.toDetail(e.author) : undefined,
    comments: e.comments ? CommentMapper.toDetails(e.comments) : [],
  });

  static toList = (e: ArticleEntity): ArticleListDto => ({
    ...this.extendedFields(e),
    author: UserMapper.toDetail(e.author),
  });

  static toDetails = (entities: ArticleEntity[]) => entities.map(this.toDetail);
  static toLists = (entities: ArticleEntity[]) => entities.map(this.toList);
}
