import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { QueryArticleDto } from '../dtos/query-article.dto';
import { Response } from 'express';
import { ArticleService } from '../services/article.service';
import {
  ArticleResponseDto,
  GetArticlesResponseDto,
} from '../dtos/article-response.dto';
import { CreateArticleDto } from '../dtos/create-article.dto';

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
    @Request() req: Request,
  ): Promise<ArticleResponseDto> {
    return this.articleService.create({
      ...createArticleDto,
      authorId: req['user'].id,
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
