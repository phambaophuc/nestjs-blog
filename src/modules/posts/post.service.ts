import { Injectable } from '@nestjs/common';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { PostRepository } from './post.repository';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    return this.postRepository.findAll(query);
  }

  async getPostById(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    return PostResponseDto.fromEntity(post);
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: UserEntity,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.create(createPostDto, user);
    return PostResponseDto.fromEntity(post);
  }
}
