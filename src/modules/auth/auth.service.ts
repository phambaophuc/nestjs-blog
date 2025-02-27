import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto, SignUpResponseDto } from './dtos/sign-up.dto';
import { SignInDto, SignInResponseDto } from './dtos/sign-in.dto';
import { AuthorRepository } from '../authors/author.repository';
import { SupabaseService } from 'src/utils/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly authorRepo: AuthorRepository,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, displayName, avatarUrl } = signUpDto;
    const { data, error } = await this.supabaseService.signUp({ ...signUpDto });

    if (error || !data.user) {
      throw new BadRequestException('User registration failed');
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
    const { data, error } = await this.supabaseService.signIn(email, password);

    if (error) throw new BadRequestException(error.message);

    return { token: data.session?.access_token };
  }

  async getUserFromToken(token: string) {
    const {
      data: { user },
    } = await this.supabaseService.getUser(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }
}
