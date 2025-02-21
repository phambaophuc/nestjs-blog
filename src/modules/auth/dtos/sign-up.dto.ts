import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty()
  @IsOptional()
  imageUrl?: string;
}

export class SignUpResponseDto {
  @ApiProperty()
  message: string;
}
