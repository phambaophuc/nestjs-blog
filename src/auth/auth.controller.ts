import { User as UserDecorator } from '@common';
import { UserResponseDto } from '@modules/users/dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import {
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards';

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto, res);
  }

  @Post('refresh')
  public async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshTokens(req, res);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async logout(
    @UserDecorator() user: UserResponseDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOut(user.id, res);
    return { message: 'Logout successful' };
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public getUser(@UserDecorator() user: UserResponseDto) {
    return user;
  }
}
