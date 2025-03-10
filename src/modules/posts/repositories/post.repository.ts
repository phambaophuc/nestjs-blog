import { IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {
    super(
      postRepository.target,
      postRepository.manager,
      postRepository.queryRunner,
    );
  }

  public async findWithFilters(filter: {
    tag?: string;
  }): Promise<PostEntity[]> {
    const queryBuilder = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tag', 'tag');

    if (filter.tag) {
      queryBuilder.where('LOWER(tag.name) = LOWER(:tag)', { tag: filter.tag });
    }

    return queryBuilder.getMany();
  }

  public async findAllRelated(
    id: string,
    limit?: number,
  ): Promise<PostEntity[]> {
    const currentPost = await this.postRepository.findOne({
      where: { id },
      relations: { tag: true },
    });

    if (!currentPost) return [];

    const relatedPosts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.tag', 'tag', 'tag.id = :tagId', {
        tagId: currentPost.tag.id,
      })
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id != :id', { id })
      .limit(limit ?? 5)
      .getMany();

    return relatedPosts;
  }

  public async findByTagId(id: string): Promise<PostEntity[]> {
    return this.find({
      where: { tag: { id } },
      relations: { tag: true, author: true },
    });
  }

  public async findById(id: string): Promise<PostEntity | null> {
    return this.findOne({
      where: { id, comments: { parent: IsNull() } },
      relations: {
        author: true,
        tag: true,
        comments: { author: true, replies: { author: true } },
      },
    });
  }

  public async store(post: CreatePostDto): Promise<PostEntity> {
    const newPost = this.create({
      ...post,
      tag: { id: post.tagId },
      author: { id: post.authorId },
    });
    return this.save(newPost);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }
}
