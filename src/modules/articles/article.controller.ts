import { JwtAuthGuard } from '@auth';
import { User } from '@common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { ArticleService } from './article.service';
import {
  ArticleResponseDto,
  CreateArticleDto,
  GetArticlesResponseDto,
  QueryArticleDto,
} from './dto';

@ApiTags('ArticleController')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOkResponse({ type: GetArticlesResponseDto })
  public async findAll(
    @Query() query: QueryArticleDto,
  ): Promise<GetArticlesResponseDto> {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleResponseDto })
  public async findById(@Param('id') id: string): Promise<ArticleResponseDto> {
    return this.articleService.findById(id);
  }

  @Get(':id/related')
  @ApiOkResponse({ type: [ArticleResponseDto] })
  public async findRelatedArticles(@Param('id') id: string) {
    return this.articleService.findAllRelated(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: ArticleResponseDto })
  public async create(
    @Body() createArticleDto: CreateArticleDto,
    @User() user: any,
  ): Promise<ArticleResponseDto> {
    return this.articleService.create({
      ...createArticleDto,
      userId: user.id,
    });
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param('id') id: string) {
    await this.articleService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Article has been deleted successfully',
    });
  }
}
