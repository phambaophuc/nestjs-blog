import { ApiProperty } from '@nestjs/swagger';
import { TagResponseDto } from 'src/modules/tags/dtos/tag-response.dto';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';
import { Post } from '../entities/post.entity';

export class PostResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Bài viết 1' })
  title: string;

  @ApiProperty({ example: 'Nội dung bài viết...' })
  content: string;

  @ApiProperty({ example: '2024-02-20T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: () => TagResponseDto, nullable: true })
  tag?: TagResponseDto;

  static fromEntity(post: Post): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
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
