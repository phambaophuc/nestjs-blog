import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'entities';

export class UserResponseDto {
  @ApiProperty({ example: 'user-1' })
  id: string;

  @ApiProperty({ example: 'user' })
  displayName: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  avatarUrl?: string;

  static fromEntity(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  static fromEntities(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => UserResponseDto.fromEntity(user));
  }
}

export class UserInternalDto {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  password: string;

  static fromEntity(user: UserEntity): UserInternalDto {
    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      password: user.password,
    };
  }
}
