import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ArticleEntity } from '@/entities';

export interface ArticleFilters {
  userId?: string;
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
    pagination: PaginationOptions,
  ): Promise<ArticleWithPagination> {
    const queryBuilder = this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    queryBuilder.orderBy('article.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findById(id: string): Promise<ArticleEntity | null> {
    return this.repository.findOne({
      where: {
        id,
        comments: { parent: IsNull() },
      },
      relations: {
        author: true,
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
    await this.repository.increment({ id }, 'viewsCount', 1);
  }
}
