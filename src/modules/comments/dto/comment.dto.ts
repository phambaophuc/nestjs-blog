import { UserResponseDto } from '@modules/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CommentEntity } from 'entities';

export class CommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsOptional()
  parentId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: () => [CommentResponseDto], nullable: true })
  @IsOptional()
  replies?: CommentResponseDto[];

  static fromEntity(comment: CommentEntity): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      user: UserResponseDto.fromEntity(comment.user),
      replies: comment.replies ?? [],
    };
  }

  static fromEntities(comments: CommentEntity[]): CommentResponseDto[] {
    return comments.map((comment) => CommentResponseDto.fromEntity(comment));
  }
}
