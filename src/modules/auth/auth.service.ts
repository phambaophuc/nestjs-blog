import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { supabase } from '../../utils/supabase';
import { SignUpDto, SignUpResponseDto } from './dtos/sign-up.dto';
import { SignInDto, SignInResponseDto } from './dtos/sign-in.dto';
import { User } from '@supabase/supabase-js';
import { ENV } from 'src/constants/env.constants';
import { AuthorRepository } from '../authors/author.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authorRepo: AuthorRepository) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, password, displayName, avatarUrl } = signUpDto;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName,
          avatarUrl,
        },
        emailRedirectTo: ENV.CLIENT_URL,
      },
    });

    if (error || !data.user) {
      throw new BadRequestException('User registered fail');
    }

    await this.authorRepo.save({
      id: data.user.id,
      displayName,
      email,
      avatarUrl,
    });

    return { message: 'User registered successfully' };
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new BadRequestException(error.message);

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
