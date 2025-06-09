import { UserService } from '@modules/users';
import { UserResponseDto } from '@modules/users/dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';

import {
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret: string;
  private readonly jwtAccessExpiresIn: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpiresIn: string;

  private readonly cookieSecure: boolean;
  private readonly cookieSameSite: 'strict' | 'lax' | 'none';

  private readonly refreshTokenPath: string;
  private readonly refreshTokenMaxAge: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessSecret = this.configService.get<string>('jwt.accessSecret')!;
    this.jwtAccessExpiresIn = this.configService.get<string>(
      'jwt.accessExpiresIn',
    )!;
    this.jwtRefreshSecret =
      this.configService.get<string>('jwt.refreshSecret')!;
    this.jwtRefreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
    )!;
    this.cookieSecure = this.configService.get<boolean>('cookie.secure')!;
    this.cookieSameSite = this.configService.get<'strict' | 'lax' | 'none'>(
      'cookie.sameSite',
    )!;
    this.refreshTokenPath = this.configService.get<string>(
      'auth.refreshTokenPath',
    )!;
    this.refreshTokenMaxAge = this.configService.get<number>(
      'auth.refreshTokenMaxAge',
    )!;
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, password, displayName, avatarUrl } = signUpDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await hash(password, 10);

    await this.userService.create({
      email,
      displayName,
      avatarUrl,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }

  async signIn(
    signInDto: SignInDto,
    res: Response,
  ): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const user = await this.userService.findWithPasswordByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const { accessToken, refreshToken } = await this.generateToken(payload);

    await this.userService.updateRefreshToken(user.id, refreshToken);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      accessToken,
      user: UserResponseDto.fromEntity(user),
    };
  }

  async refreshTokens(
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string }> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtRefreshSecret,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email };
      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateToken(newPayload);

      await this.userService.updateRefreshToken(user.id, newRefreshToken);
      this.setRefreshTokenCookie(res, newRefreshToken);

      return { accessToken };
    } catch {
      this.clearRefreshTokenCookie(res);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signOut(userId: string, res: Response): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
    this.clearRefreshTokenCookie(res);
  }

  async validateUser(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid token');
      }

      throw new BadRequestException(error.message);
    }
  }

  private async generateToken(payload: { sub: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtAccessSecret,
        expiresIn: this.jwtAccessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: this.cookieSameSite,
      maxAge: this.refreshTokenMaxAge,
      path: this.refreshTokenPath,
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: this.cookieSameSite,
      path: this.refreshTokenPath,
    });
  }
}
