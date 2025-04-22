import { UserService } from '@modules/users';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '@shared';

import {
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, displayName, avatarUrl } = signUpDto;
    const { data, error } = await this.supabaseService.signUp({ ...signUpDto });

    if (error || !data.user) {
      throw new BadRequestException('User registration failed');
    }

    await this.userService.create({
      id: data.user.id,
      displayName,
      email,
      avatarUrl,
    });

    return { message: 'User registered successfully' };
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const { data, error } = await this.supabaseService.signIn(email, password);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { token: data.session?.access_token };
  }

  async getUserFromToken(token: string) {
    const {
      data: { user },
    } = await this.supabaseService.getUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
