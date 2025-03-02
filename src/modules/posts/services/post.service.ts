import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryPostsDto } from '../dtos/query-posts.dto';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostRepository } from '../repositories/post.repository';
import {
  GetPostsResponseDto,
  PostResponseDto,
} from '../dtos/post-response.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findAll(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    try {
      const { tag, page = 1, limit = 10 } = query;
      const posts = await this.postRepository.findWithFilters({ tag });

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedPosts = posts.slice(start, end);

      return {
        data: paginatedPosts,
        limit,
        page: Number(page),
        totalPages: Math.ceil(posts.length / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<PostResponseDto> {
    try {
      const post = await this.postRepository.findById(id);
      if (!post) {
        throw new NotFoundException('Post not found.');
      }
      return PostResponseDto.fromEntity(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    try {
      const post = await this.postRepository.store(createPostDto);
      return PostResponseDto.fromEntity(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.postRepository.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
