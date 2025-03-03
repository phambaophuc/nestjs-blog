import { ApiProperty } from '@nestjs/swagger';
import { TagResponseDto } from 'src/modules/tags/dtos/tag-response.dto';
import { PostEntity } from '../entities/post.entity';
import { AuthorResponseDto } from 'src/modules/authors/dtos/author-response.dto';

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

  @ApiProperty({ type: () => AuthorResponseDto })
  author: AuthorResponseDto;

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
      author: post.author,
      tag: post.tag,
    };
  }

  static fromEntities(posts: PostEntity[]): PostResponseDto[] {
    return posts.map((post) => PostResponseDto.fromEntity(post));
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
