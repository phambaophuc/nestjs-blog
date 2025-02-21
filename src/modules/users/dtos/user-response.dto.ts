import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 'user-1' })
  id: string;

  @ApiProperty({ example: 'user' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  imageUrl?: string;

  static fromEntity(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
    };
  }

  static fromEntities(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => UserResponseDto.fromEntity(user));
  }
}
