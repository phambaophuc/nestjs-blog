import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from '@supabase/supabase-js';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOkResponse({ type: GetPostsResponseDto })
  getAllPosts(@Query() query: QueryPostsDto): Promise<GetPostsResponseDto> {
    return this.postService.getAllPosts(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostResponseDto })
  getPostById(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: PostResponseDto })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: Request,
  ): Promise<PostResponseDto> {
    const { id } = req['user'] as User;
    return this.postService.createPost({
      ...createPostDto,
      authorId: id,
    });
  }
}
