import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ArticleService } from '../articles';
import { CommentRepository } from './comment.repository';
import { CommentResponseDto, CreateCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly articleService: ArticleService,
  ) {}

  async create(comment: CreateCommentDto): Promise<CommentResponseDto> {
    try {
      const { articleId, parentId } = comment;

      const article = await this.articleService.findById(articleId);
      if (!article) throw new NotFoundException('Article not found.');

      let parentComment;
      if (parentId) {
        parentComment = await this.commentRepo.findById(parentId);
        if (!parentComment)
          throw new NotFoundException('Parent comment not found.');
      }

      const newComment = await this.commentRepo.store(comment);
      return this.findById(newComment.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<CommentResponseDto[]> {
    try {
      const comments = await this.commentRepo.findAll();
      return CommentResponseDto.fromEntities(comments);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<CommentResponseDto> {
    try {
      const comment = await this.commentRepo.findById(id);
      if (!comment) throw new NotFoundException('Comment not found.');
      return CommentResponseDto.fromEntity(comment);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.commentRepo.destroy(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
