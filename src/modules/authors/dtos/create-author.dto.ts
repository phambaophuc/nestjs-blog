import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'author-1' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'author' })
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: 'author@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  @IsOptional()
  avatarUrl?: string;
}
