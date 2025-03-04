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
import { SubscribersService } from 'src/modules/subscribers/services/subscribers.service';
import { EmailService } from 'src/utils/nodemailer/email.service';
import { ENV } from 'src/constants/env.constants';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly subscriberService: SubscribersService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    try {
      const { tag, page = 1, limit = 10 } = query;
      const posts = await this.postRepo.findWithFilters({ tag });

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
      const post = await this.postRepo.findById(id);
      if (!post) {
        throw new NotFoundException('Post not found.');
      }
      return PostResponseDto.fromEntity(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllRelated(id: string, limit?: number): Promise<PostResponseDto[]> {
    try {
      const relatedPosts = await this.postRepo.findAllRelated(id, limit);
      return PostResponseDto.fromEntities(relatedPosts);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    try {
      const post = await this.postRepo.store(createPostDto);

      const subscribers = await this.subscriberService.findAll();

      for (const subscriber of subscribers) {
        await this.emailService.sendEmail(
          subscriber.email,
          `New Blog: ${post.title}`,
          `<h1>${post.title}</h1><p>${post.content.substring(0, 200)}...</p><a href="${ENV.CLIENT_URL}/posts/${post.id}">Xem bài viết</a>`,
        );
      }

      return PostResponseDto.fromEntity(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.postRepo.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
