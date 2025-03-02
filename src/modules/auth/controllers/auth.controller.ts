import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto, SignInResponseDto } from '../dtos/sign-in.dto';
import { SignUpDto, SignUpResponseDto } from '../dtos/sign-up.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('AuthController')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  public async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async getUser(@Request() req: Request): Promise<User> {
    return (await req['user']) as User;
  }
}
