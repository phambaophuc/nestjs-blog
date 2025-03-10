import { ApiProperty } from '@nestjs/swagger';
import { AuthorResponseDto } from 'src/modules/authors/dtos/author-response.dto';
import { CommentEntity } from '../entities/comment.entity';

export class CommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => AuthorResponseDto })
  author: AuthorResponseDto;

  @ApiProperty({ type: () => [CommentResponseDto], nullable: true })
  replies?: CommentResponseDto[];

  static fromEntity(comment: CommentEntity): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: AuthorResponseDto.fromEntity(comment.author),
      replies: comment.replies ?? [],
    };
  }

  static fromEntities(comments: CommentEntity[]): CommentResponseDto[] {
    return comments.map((comment) => CommentResponseDto.fromEntity(comment));
  }
}
