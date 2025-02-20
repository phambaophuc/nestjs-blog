import { Injectable } from '@nestjs/common';
import { supabase } from '../../utils/supabase';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, fullName } = signUpDto;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw new Error(error.message);

    await this.usersService.createOrUpdate({
      id: data.user?.id,
      email,
      fullName,
    });

    return { message: 'User registered successfully' };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return { token: data.session?.access_token };
  }
}
