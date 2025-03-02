import { Repository } from 'typeorm';
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
      queryBuilder.where('tag.name = :tag', { tag: filter.tag });
    }

    return queryBuilder.getMany();
  }

  public async findById(id: string): Promise<PostEntity | null> {
    return this.findOne({
      where: { id },
      relations: { author: true, tag: true },
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
