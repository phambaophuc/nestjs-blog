import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../../utils/supabase';
import { SignUpDto, SignUpResponseDto } from './dtos/sign-up.dto';
import { SignInDto, SignInResponseDto } from './dtos/sign-in.dto';
import { UserService } from '../users/user.service';
import { User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, password, fullName, imageUrl } = signUpDto;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw new Error(error.message);

    if (data.user) {
      await this.userService.createUser({
        id: data.user.id,
        fullName,
        email,
        imageUrl,
      });
    }

    return { message: 'User registered successfully' };
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return { token: data.session?.access_token };
  }

  async getUserFromToken(token: string): Promise<User> {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid token');
    }

    return data.user;
  }
}
