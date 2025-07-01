import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ArticleService } from '../articles';
import { CommentRepository } from './comment.repository';
import {
  CommentDetailResponse,
  CommentListResponse,
  CommentMapper,
  CreateCommentDto,
} from './dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly articleService: ArticleService,
  ) {}

  async create(
    comment: CreateCommentDto,
    userId: string,
  ): Promise<CommentDetailResponse> {
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

      const newComment = await this.commentRepo.store({ ...comment, userId });
      return this.findById(newComment.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<CommentListResponse[]> {
    try {
      const comments = await this.commentRepo.findAll();
      return CommentMapper.toLists(comments);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<CommentDetailResponse> {
    try {
      const comment = await this.commentRepo.findById(id);
      if (!comment) throw new NotFoundException('Comment not found.');
      return CommentMapper.toDetail(comment);
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
