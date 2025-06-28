import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { GeminiService, HtmlUtilsService } from '@/shared';

import { TagService } from '../tags';
import { ArticleRepository } from './article.repository';
import {
  ArticleResponseDto,
  CreateArticleDto,
  GetArticlesResponseDto,
  QueryArticleDto,
} from './dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly tagService: TagService,
    private readonly geminiService: GeminiService,
    private readonly htmlUtilsService: HtmlUtilsService,
  ) {}

  async findAll(query: QueryArticleDto): Promise<GetArticlesResponseDto> {
    try {
      const { page = 1, limit = 10 } = query;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      const pagination = { page: Number(page), limit: Number(limit) };

      const { data: articles, total } =
        await this.articleRepo.findWithFiltersAndPagination(pagination);

      return {
        data: articles,
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

  async findById(id: string): Promise<ArticleResponseDto> {
    try {
      this.incrementViewsAsync(id);

      const article = await this.articleRepo.findById(id);

      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      return ArticleResponseDto.fromEntity(article);
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
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<ArticleResponseDto> {
    try {
      const { content, title } = createArticleDto;

      if (!content?.trim()) {
        throw new BadRequestException('Article content is required');
      }

      if (!title?.trim()) {
        throw new BadRequestException('Article title is required');
      }

      const [slug, excerpt, imageUrl, readingTime, tags] = await Promise.all([
        this.generateSlug(title),
        this.generateExcerpt(content),
        this.extractImageUrl(content),
        this.calculateReadingTime(content),
        this.tagService.generateTagsAndSave(content),
      ]);

      const articleData = {
        ...createArticleDto,
        slug,
        excerpt,
        coverImageUrl: imageUrl ?? undefined,
        readingTime,
        tags,
        authorId: userId,
      };

      const article = await this.articleRepo.store(articleData);

      return ArticleResponseDto.fromEntity(article);
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

  async delete(id: string): Promise<void> {
    try {
      return await this.articleRepo.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  private async generateExcerpt(content: string): Promise<string> {
    try {
      return await this.geminiService.summarize(content);
    } catch (error) {
      this.logger.warn(`Failed to generate description: ${error.message}`);
      return content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
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

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
