import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  description: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tagId: string;

  authorId: string;
}
