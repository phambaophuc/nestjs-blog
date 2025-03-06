import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { PostService } from 'src/modules/posts/services/post.service';
import { CommentResponseDto } from '../dtos/comment-response.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postService: PostService,
  ) {}

  async create(comment: CreateCommentDto): Promise<CommentResponseDto> {
    try {
      const { postId, parentId } = comment;

      const post = await this.postService.findById(postId);
      if (!post) throw new NotFoundException('Post not found.');

      let parentComment;
      if (parentId) {
        parentComment = await this.commentRepo.findById(parentId);
        if (!parentComment)
          throw new NotFoundException('Parent comment not found.');
      }

      const newComment = await this.commentRepo.store(comment);
      return CommentResponseDto.fromEntity(newComment);
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
