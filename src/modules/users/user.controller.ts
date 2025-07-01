import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { UserDetailResponse, UserListResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('UserController')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: [UserListResponse] })
  public async findAll(): Promise<UserListResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDetailResponse })
  public async findById(@Param('id') id: string): Promise<UserDetailResponse> {
    return this.userService.findById(id);
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param('id') id: string) {
    await this.userService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'User has been deleted successfully',
    });
  }
}
