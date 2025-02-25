import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '../entities/author.entity';

export class AuthorResponseDto {
  @ApiProperty({ example: 'author-1' })
  id: string;

  @ApiProperty({ example: 'author' })
  displayName: string;

  @ApiProperty({ example: 'author@example.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  avatarUrl?: string;

  static fromEntity(author: AuthorEntity): AuthorResponseDto {
    return {
      id: author.id,
      displayName: author.displayName,
      email: author.email,
      avatarUrl: author.avatarUrl,
    };
  }

  static fromEntities(authors: AuthorEntity[]): AuthorResponseDto[] {
    return authors.map((author) => AuthorResponseDto.fromEntity(author));
  }
}
