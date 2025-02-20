import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
