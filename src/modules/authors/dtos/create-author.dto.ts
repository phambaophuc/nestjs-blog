import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'author-1' })
  id: string;

  @ApiProperty({ example: 'author' })
  displayName: string;

  @ApiProperty({ example: 'author@example.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  avatarUrl?: string;
}
