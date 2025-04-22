import { SubscribersService } from '@modules/subscribers';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeminiService, HtmlUtilsService } from '@shared';

import { ArticleRepository } from './article.repository';
import {
  ArticleResponseDto,
  CreateArticleDto,
  GetArticlesResponseDto,
  QueryArticleDto,
} from './dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly subscriberService: SubscribersService,
    private readonly geminiService: GeminiService,
    private readonly htmlUtilsService: HtmlUtilsService,
  ) {}

  async findAll(query: QueryArticleDto): Promise<GetArticlesResponseDto> {
    try {
      const { tag, page = 1, limit = 10 } = query;
      const articles = await this.articleRepo.findWithFilters({ tag });

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedArticles = articles.slice(start, end);

      return {
        data: paginatedArticles,
        limit,
        page: Number(page),
        totalPages: Math.ceil(articles.length / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<ArticleResponseDto> {
    try {
      await this.articleRepo.incrementArticleViews(id);
      const article = await this.articleRepo.findById(id);
      if (!article) {
        throw new NotFoundException('Article not found.');
      }
      return ArticleResponseDto.fromEntity(article);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllRelated(
    id: string,
    limit?: number,
  ): Promise<ArticleResponseDto[]> {
    try {
      const relatedArticles = await this.articleRepo.findAllRelated(id, limit);
      return ArticleResponseDto.fromEntities(relatedArticles);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    try {
      const { content } = createArticleDto;
      const article = await this.articleRepo.store({
        ...createArticleDto,
        description: await this.geminiService.summarize(content),
        imageUrl: this.htmlUtilsService.extractFirstImage(content)!,
      });

      await this.subscriberService.sendArticleForAll(article);

      return ArticleResponseDto.fromEntity(article);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.articleRepo.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
