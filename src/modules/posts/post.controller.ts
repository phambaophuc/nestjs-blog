import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { PostService } from './post.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';

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
  getPostById(@Param() id: string): Promise<PostResponseDto> {
    return this.postService.getPostById(id);
  }
}
