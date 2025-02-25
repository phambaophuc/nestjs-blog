import { DataSource, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPostsDto } from './dtos/query-posts.dto';
import { GetPostsResponseDto } from './dtos/post-response.dto';
import { TagEntity } from '../tags/entities/tag.entity';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    private readonly dataSource: DataSource,
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

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { tagName } = createPostDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let tag = await queryRunner.manager.findOne(TagEntity, {
        where: { name: tagName },
      });

      if (!tag) {
        tag = queryRunner.manager.create(TagEntity, { name: tagName });
        await queryRunner.manager.save(tag);
      }

      const post = queryRunner.manager.create(PostEntity, {
        ...createPostDto,
        author: {
          id: createPostDto.author,
        },
      });

      const savedPost: PostEntity = await queryRunner.manager.save(post);

      await queryRunner.commitTransaction();
      return savedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
