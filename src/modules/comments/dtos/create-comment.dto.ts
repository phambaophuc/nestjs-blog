import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsUUID()
  postId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parentId?: string;

  authorId: string;
}
