import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { GetPostsResponseDto, PostResponseDto } from './dtos/post-response.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async findAll(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    const { tagName, page = 1, limit = 10 } = query;

    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.tag', 'tag');

    if (tagName) {
      queryBuilder.where('tag.name = :tagName', { tagName });
    }

    const total = await queryBuilder.getCount();
    const totalPages = Math.ceil(total / limit);

    const posts = await queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: posts,
      limit,
      page,
      totalPages,
    };
  }

  async findById(id: string): Promise<PostResponseDto> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    return PostResponseDto.fromEntity(post);
  }
}
