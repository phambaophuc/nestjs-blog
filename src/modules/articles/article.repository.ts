import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'entities';
import { IsNull, Not, Repository } from 'typeorm';

export interface ArticleFilters {
  tag?: string;
  userId?: string;
  isPublished?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ArticleWithPagination {
  data: ArticleEntity[];
  total: number;
}

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private repository: Repository<ArticleEntity>,
  ) {}

  async findWithFiltersAndPagination(
    filters: ArticleFilters,
    pagination: PaginationOptions,
  ): Promise<ArticleWithPagination> {
    const queryBuilder = this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.tag', 'tag');

    if (filters.tag) {
      queryBuilder.andWhere('LOWER(tag.name) = LOWER(:tag)', {
        tag: filters.tag,
      });
    }

    if (filters.userId) {
      queryBuilder.andWhere('article.userId = :userId', {
        userId: filters.userId,
      });
    }

    if (filters.isPublished !== undefined) {
      queryBuilder.andWhere('article.isPublished = :isPublished', {
        isPublished: filters.isPublished,
      });
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    queryBuilder.orderBy('article.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findAllRelated(
    articleId: string,
    limit: number = 5,
  ): Promise<ArticleEntity[]> {
    const currentArticle = await this.repository.findOne({
      where: { id: articleId },
      relations: { tag: true },
    });

    if (!currentArticle?.tag) {
      return [];
    }

    return this.repository.find({
      where: {
        tag: { id: currentArticle.tag.id },
        id: Not(articleId),
      },
      relations: { user: true, tag: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByTagId(tagId: string): Promise<ArticleEntity[]> {
    return this.repository.find({
      where: {
        tag: { id: tagId },
      },
      relations: { tag: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ArticleEntity | null> {
    return this.repository.findOne({
      where: {
        id,
        comments: { parent: IsNull() },
      },
      relations: {
        user: true,
        tag: true,
        comments: {
          user: true,
          replies: { user: true },
        },
      },
    });
  }

  async store(articleData: Partial<ArticleEntity>): Promise<ArticleEntity> {
    const article = this.repository.create(articleData);
    return this.repository.save(article);
  }

  public async destroy(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await this.repository.increment({ id }, 'views', 1);
  }
}
