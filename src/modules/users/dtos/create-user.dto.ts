import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user-1' })
  id: string;

  @ApiProperty({ example: 'user' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  imageUrl?: string;
}
