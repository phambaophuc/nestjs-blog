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
import { User } from '@/common';

import { UserResponseDto } from '../users/dto';
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
  @ApiOkResponse({
    description: 'Successfully retrieved articles',
    type: GetArticlesResponseDto,
  })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  public async findAll(
    @Query() query: QueryArticleDto,
  ): Promise<GetArticlesResponseDto> {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved article',
    type: ArticleResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Article ID' })
  public async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArticleResponseDto> {
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
    type: ArticleResponseDto,
  })
  public async create(
    @Body() createArticleDto: CreateArticleDto,
    @User() user: UserResponseDto,
  ): Promise<ArticleResponseDto> {
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
