import { Injectable } from '@nestjs/common';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { PostRepository } from './post.repository';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    return this.postRepository.findAll(query);
  }

  getPostById(id: string): Promise<PostResponseDto> {
    return this.postRepository.findById(id);
  }
}
