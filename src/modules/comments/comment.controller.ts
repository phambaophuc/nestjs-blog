import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAuthGuard } from '@/auth';
import { UserDecorator } from '@/common';

import { UserDetailResponse } from '../users';
import { CommentService } from './comment.service';
import {
  CommentDetailResponse,
  CommentListResponse,
  CreateCommentDto,
} from './dto';

@ApiTags('CommentController')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOkResponse({ type: [CommentListResponse] })
  public async findAll(): Promise<CommentListResponse[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CommentDetailResponse })
  public async findById(
    @Param('id') id: string,
  ): Promise<CommentDetailResponse> {
    return this.commentService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CommentDetailResponse })
  public async create(
    @UserDecorator() user: UserDetailResponse,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentDetailResponse> {
    return this.commentService.create(comment, user.id);
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param('id') id: string) {
    await this.commentService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Comment has been deleted successfully',
    });
  }
}
