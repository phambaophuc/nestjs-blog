import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

import { CommentEntity } from '../entities/comment.entity';

export class CommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: () => [CommentResponseDto], nullable: true })
  replies?: CommentResponseDto[];

  static fromEntity(comment: CommentEntity): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: UserResponseDto.fromEntity(comment.user),
      replies: comment.replies ?? [],
    };
  }

  static fromEntities(comments: CommentEntity[]): CommentResponseDto[] {
    return comments.map((comment) => CommentResponseDto.fromEntity(comment));
  }
}
