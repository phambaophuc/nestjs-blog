import { ENV } from '@constants/env.constants';
import { SubscribersService } from '@modules/subscribers/services/subscribers.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeminiService } from '@utils/gemini/gemini.service';
import { EmailService } from '@utils/nodemailer/email.service';

import {
  ArticleResponseDto,
  GetArticlesResponseDto,
} from '../dtos/article-response.dto';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { QueryArticleDto } from '../dtos/query-article.dto';
import { ArticleRepository } from '../repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly subscriberService: SubscribersService,
    private readonly emailService: EmailService,
    private readonly geminiService: GeminiService,
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
      });

      const subscribers = await this.subscriberService.findAll();

      for (const subscriber of subscribers) {
        await this.emailService.sendEmail(
          subscriber.email,
          `New Blog: ${article.title}`,
          `<h1>${article.title}</h1><p>${article.content.substring(0, 200)}...</p><a href="${ENV.CLIENT_URL}/articles/${article.id}">Xem bài viết</a>`,
        );
      }

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
