import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  @IsOptional()
  avatarUrl?: string;
}
