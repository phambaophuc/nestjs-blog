import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { ArticleEntity } from '@/entities';
import {
  calculateReadingTime,
  generateExcerpt,
  HtmlUtilsService,
  slugify,
} from '@/shared';

import { TagService } from '../tags';
import { ArticleRepository } from './article.repository';
import {
  ArticleDetailResponse,
  ArticleListResponse,
  ArticleMapper,
  CreateArticleDto,
  QueryArticleDto,
} from './dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly tagService: TagService,
    private readonly htmlUtilsService: HtmlUtilsService,
  ) {}

  async findAll(query: QueryArticleDto): Promise<ArticleListResponse> {
    try {
      const { page = 1, limit = 10 } = query;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      const pagination = { page: Number(page), limit: Number(limit) };

      const { data: articles, total } =
        await this.articleRepo.findWithFiltersAndPagination(pagination);

      return {
        data: ArticleMapper.toLists(articles),
        limit: pagination.limit,
        page: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
        total,
      };
    } catch (error) {
      this.logger.error(
        `Error finding articles: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to retrieve articles');
    }
  }

  async findBySlug(slug: string): Promise<ArticleDetailResponse> {
    try {
      const article = await this.articleRepo.findBySlug(slug);

      if (!article) {
        throw new NotFoundException(`Article ${slug} not found`);
      }
      this.incrementViewsAsync(article.id);

      return ArticleMapper.toDetail(article);
    } catch (error) {
      this.logger.error(
        `Error finding article ${slug}: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to retrieve article');
    }
  }

  async findById(id: string): Promise<ArticleDetailResponse> {
    try {
      const article = await this.articleRepo.findById(id);

      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      return ArticleMapper.toDetail(article);
    } catch (error) {
      this.logger.error(
        `Error finding article ${id}: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to retrieve article');
    }
  }

  async create(
    dto: CreateArticleDto,
    authorId: string,
  ): Promise<ArticleDetailResponse> {
    try {
      const articleData = await this.handleArticle(dto);
      const article = await this.articleRepo.store({
        ...articleData,
        authorId,
      });

      return ArticleMapper.toDetail(article);
    } catch (error) {
      this.logger.error(
        `Error creating article: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to create article');
    }
  }

  async createIfNotExists(
    dto: CreateArticleDto,
    authorId: string,
  ): Promise<boolean> {
    const slug = slugify(dto.title);

    try {
      const exists = await this.articleRepo.findBySlug(slug);

      if (!exists) {
        const article = await this.handleArticle(dto);
        await this.articleRepo.store({ ...article, authorId });
        return true;
      }

      return false;
    } catch (error) {
      throw new Error('Unable to create article', error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.articleRepo.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async handleArticle(
    dto: CreateArticleDto,
  ): Promise<Partial<ArticleEntity>> {
    const { content, title } = dto;

    if (!content?.trim()) {
      throw new BadRequestException('Article content is required');
    }

    if (!title?.trim()) {
      throw new BadRequestException('Article title is required');
    }

    const [slug, excerpt, imageUrl, readingTime, tags] = await Promise.all([
      slugify(title),
      generateExcerpt(content),
      this.extractImageUrl(content),
      calculateReadingTime(content),
      this.tagService.generateTagsAndSave(content),
    ]);

    return {
      ...dto,
      slug,
      excerpt,
      coverImageUrl: imageUrl ?? undefined,
      readingTime,
      tags,
    };
  }

  private async incrementViewsAsync(id: string): Promise<void> {
    try {
      await this.articleRepo.incrementViews(id);
    } catch (error) {
      this.logger.warn(
        `Failed to increment views for article ${id}: ${error.message}`,
      );
    }
  }

  private extractImageUrl(content: string): string | null {
    try {
      return this.htmlUtilsService.extractFirstImage(content);
    } catch (error) {
      this.logger.warn(`Failed to extract image URL: ${error.message}`);
      return null;
    }
  }
}
