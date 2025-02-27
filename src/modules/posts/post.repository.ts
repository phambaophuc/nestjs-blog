import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { GetPostsResponseDto } from './dtos/post-response.dto';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async findAll(query: QueryPostsDto): Promise<GetPostsResponseDto> {
    const { tag, page = 1, limit = 10 } = query;

    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tag', 'tag');

    if (tag) {
      queryBuilder.where('tag.name = :tag', { tag });
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
      page: Number(page),
      totalPages,
    };
  }

  findById(id: string): Promise<PostEntity> {
    return this.postRepo.findOneOrFail({
      where: { id },
      relations: { author: true, tag: true },
    });
  }

  save(post: CreatePostDto): Promise<PostEntity> {
    return this.postRepo.save({
      ...post,
      tag: {
        id: post.tagId,
      },
      author: {
        id: post.authorId,
      },
    });
  }
}
