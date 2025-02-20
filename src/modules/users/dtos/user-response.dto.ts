import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 'user-1' })
  id: string;

  @ApiProperty({ example: 'user' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  imageUrl?: string;

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
    };
  }

  static fromEntities(users: User[]): UserResponseDto[] {
    return users.map((user) => UserResponseDto.fromEntity(user));
  }
}
