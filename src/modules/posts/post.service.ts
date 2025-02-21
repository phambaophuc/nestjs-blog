import { Injectable } from '@nestjs/common';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { PostRepository } from './post.repository';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';
import { TagRepository } from '../tags/tag.repository';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

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
    const { title, description, content, imageUrl, tagName } = createPostDto;
    const tag = await this.tagRepository.findOrCreate(tagName);

    const post = await this.postRepository.save({
      title,
      description,
      content,
      imageUrl,
      user,
      tag,
    });

    return PostResponseDto.fromEntity(post);
  }
}
