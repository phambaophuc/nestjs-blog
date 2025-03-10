import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dtos/create-comment.dto';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {
    super(commentRepo.target, commentRepo.manager, commentRepo.queryRunner);
  }

  public async findAll(): Promise<CommentEntity[]> {
    return this.find({
      where: { parent: IsNull() },
      relations: { author: true, replies: { author: true } },
      order: { createdAt: 'DESC' },
    });
  }

  public async findById(id: string): Promise<CommentEntity | null> {
    return this.findOne({
      where: { id },
      relations: { author: true, replies: { author: true } },
    });
  }

  public async store(comment: CreateCommentDto): Promise<CommentEntity> {
    const newComment = this.create({
      ...comment,
      post: { id: comment.postId },
      author: { id: comment.authorId },
      parent: { id: comment.parentId },
    });
    return this.save(newComment);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }
}
