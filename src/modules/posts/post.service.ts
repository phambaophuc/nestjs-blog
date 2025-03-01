import { Injectable } from '@nestjs/common';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { PostRepository } from './post.repository';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { TagRepository } from '../tags/tag.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly tagRepo: TagRepository,
  ) {}

  getAllPosts(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    return this.postRepo.findAll(query);
  }

  async getPostById(id: string): Promise<PostResponseDto> {
    const post = await this.postRepo.findById(id);
    return PostResponseDto.fromEntity(post);
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    await this.tagRepo.findById(createPostDto.tagId);
    const post = await this.postRepo.save(createPostDto);
    return PostResponseDto.fromEntity(post);
  }
}
