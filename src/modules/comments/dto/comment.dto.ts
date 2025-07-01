import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { UserDetailDto } from '@/modules/users';

class CommentBaseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}

export class CommentDetailDto extends CommentBaseDto {
  @ApiPropertyOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ type: () => UserDetailDto })
  user?: UserDetailDto;

  @ApiPropertyOptional({ type: () => [CommentDetailDto], nullable: true })
  replies?: CommentDetailDto[];
}

export class CommentListDto extends CommentBaseDto {
  @ApiPropertyOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ type: () => UserDetailDto })
  user?: UserDetailDto;

  @ApiPropertyOptional({ type: () => [CommentDetailDto], nullable: true })
  replies?: CommentDetailDto[];

  @ApiProperty()
  repliesCount: number;
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsUUID()
  articleId: string;

  @ApiPropertyOptional({ required: false })
  @IsUUID()
  parentId?: string;
}
