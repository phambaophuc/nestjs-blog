import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsUUID()
  articleId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parentId?: string;

  authorId: string;
}
