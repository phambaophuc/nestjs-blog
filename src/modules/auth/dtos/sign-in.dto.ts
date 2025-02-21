import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  token: string;
}
