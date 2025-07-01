import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth';
import { UserDecorator } from '@/common';

import { UserDetailResponse } from '../users';
import { ArticleService } from './article.service';
import {
  ArticleDetailResponse,
  ArticleListResponse,
  CreateArticleDto,
  QueryArticleDto,
} from './dto';

@ApiTags('ArticleController')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved articles',
    type: ArticleListResponse,
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  public async findAll(
    @Query() query: QueryArticleDto,
  ): Promise<ArticleListResponse> {
    return this.articleService.findAll(query);
  }

  @Get('slug/:slug')
  @ApiOkResponse({
    description: 'Successfully retrieved article',
    type: ArticleDetailResponse,
  })
  @ApiParam({ name: 'slug', description: 'Article Slug' })
  public async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleDetailResponse> {
    return this.articleService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved article',
    type: ArticleDetailResponse,
  })
  @ApiParam({ name: 'id', description: 'Article ID' })
  public async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArticleDetailResponse> {
    return this.articleService.findById(id);
  }

  // @Get(':id/related')
  // @ApiOkResponse({
  //   description: 'Successfully retrieved related articles',
  //   type: [ArticleResponseDto],
  // })
  // @ApiParam({ name: 'id', description: 'Article ID' })
  // public async findRelatedArticles(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.articleService.findAllRelated(id);
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article created successfully',
    type: ArticleDetailResponse,
  })
  public async create(
    @Body() createArticleDto: CreateArticleDto,
    @UserDecorator() user: UserDetailResponse,
  ): Promise<ArticleDetailResponse> {
    return this.articleService.create(createArticleDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Article deleted successfully',
  })
  @ApiParam({ name: 'id', description: 'Article ID' })
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.articleService.delete(id);
  }
}
