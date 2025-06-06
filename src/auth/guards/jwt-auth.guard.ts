import { AuthService } from '@auth/auth.service';
import { UserResponseDto } from '@modules/users/dto';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserResponseDto;
    }
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();

      // Check if route is marked as public
      // const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      //   context.getHandler(),
      //   context.getClass(),
      // ]);

      // if (isPublic) {
      //   return true;
      // }

      const token = this.extractTokenFromHeader(request);

      if (!token) {
        this.logger.warn(
          `Authentication failed: No token provided from ${request.ip}`,
        );
        throw new UnauthorizedException('Authentication token is required');
      }

      // Validate token format (basic JWT structure check)
      if (!this.isValidJwtFormat(token)) {
        this.logger.warn(
          `Authentication failed: Invalid token format from ${request.ip}`,
        );
        throw new UnauthorizedException('Invalid token format');
      }

      const user = await this.authService.validateUser(token);

      if (!user) {
        this.logger.warn(
          `Authentication failed: Invalid or expired token from ${request.ip}`,
        );
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Check if user is active/enabled
      // if (user.isBlocked || !user.isActive) {
      //   this.logger.warn(
      //     `Authentication failed: User ${user.id} is blocked or inactive`,
      //   );
      //   throw new ForbiddenException('Account is disabled or blocked');
      // }

      request.user = user;

      this.logger.debug(`User ${user.id} authenticated successfully`);
      return true;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      this.logger.error(
        `Unexpected authentication error: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const parts = authHeader.split(' ');

    // Check if header format is correct: "Bearer <token>"
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return undefined;
    }

    const token = parts[1];

    // Basic token validation
    if (!token || token.length === 0) {
      return undefined;
    }

    return token;
  }

  private isValidJwtFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every((part) => part.length > 0);
  }
}
