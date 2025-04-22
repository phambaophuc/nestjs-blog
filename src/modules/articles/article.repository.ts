import { ArticleEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { CreateArticleDto } from './dto';

@Injectable()
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {
    super(
      articleRepository.target,
      articleRepository.manager,
      articleRepository.queryRunner,
    );
  }

  public async findWithFilters(filter: {
    tag?: string;
  }): Promise<ArticleEntity[]> {
    const queryBuilder = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.tag', 'tag');

    if (filter.tag) {
      queryBuilder.where('LOWER(tag.name) = LOWER(:tag)', { tag: filter.tag });
    }

    queryBuilder.orderBy('article.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  public async findAllRelated(
    id: string,
    limit?: number,
  ): Promise<ArticleEntity[]> {
    const currentArticle = await this.findOne({
      where: { id },
      relations: { tag: true },
    });

    if (!currentArticle) return [];

    const relatedArticles = await this.find({
      where: {
        tag: { id: currentArticle.tag.id },
        id: Not(id),
      },
      relations: { user: true, tag: true },
      take: limit ?? 5,
    });

    return relatedArticles;
  }

  public async findByTagId(id: string): Promise<ArticleEntity[]> {
    return this.find({
      where: { tag: { id } },
      relations: { tag: true, user: true },
    });
  }

  public async findById(id: string): Promise<ArticleEntity | null> {
    return this.findOne({
      where: { id, comments: { parent: IsNull() } },
      relations: {
        user: true,
        tag: true,
        comments: { user: true, replies: { user: true } },
      },
    });
  }

  public async store(article: CreateArticleDto): Promise<ArticleEntity> {
    const newArticle = this.create({
      ...article,
      tag: { id: article.tagId },
      user: { id: article.userId },
    });
    return this.save(newArticle);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }

  public async incrementArticleViews(id: string): Promise<void> {
    await this.increment({ id }, 'views', 1);
  }
}
