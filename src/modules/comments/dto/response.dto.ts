import { CommentEntity } from '@entities';
import { UserResponseDto } from '@modules/users/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

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
