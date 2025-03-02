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
import { CreatePostDto } from '../dtos/create-post.dto';
import {
  GetPostsResponseDto,
  PostResponseDto,
} from '../dtos/post-response.dto';
import { QueryPostsDto } from '../dtos/query-posts.dto';
import { PostService } from '../services/post.service';
import { Response } from 'express';

@ApiTags('PostController')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOkResponse({ type: GetPostsResponseDto })
  public async findAll(
    @Query() query: QueryPostsDto,
  ): Promise<GetPostsResponseDto> {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostResponseDto })
  public async findById(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: PostResponseDto })
  public async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: Request,
  ): Promise<PostResponseDto> {
    return this.postService.create({
      ...createPostDto,
      authorId: req['user'].id,
    });
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param() id: string) {
    await this.postService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Post has been deleted successfully',
    });
  }
}
