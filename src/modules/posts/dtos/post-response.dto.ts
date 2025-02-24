import { ApiProperty } from '@nestjs/swagger';
import { TagResponseDto } from 'src/modules/tags/dtos/tag-response.dto';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';
import { PostEntity } from '../entities/post.entity';

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: () => TagResponseDto, nullable: true })
  tag?: TagResponseDto;

  static fromEntity(post: PostEntity): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user,
      tag: post.tag,
    };
  }
}

export class GetPostsResponseDto {
  @ApiProperty({ type: () => [PostResponseDto] })
  data: PostResponseDto[];

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 4 })
  totalPages: number;
}
