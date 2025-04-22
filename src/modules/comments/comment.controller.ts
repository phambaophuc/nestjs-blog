import { JwtAuthGuard } from '@auth';
import { User as UserDecorator } from '@common';
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
import { User } from '@supabase/supabase-js';
import { Response } from 'express';

import { CommentService } from './comment.service';
import { CommentResponseDto, CreateCommentDto } from './dto';

@ApiTags('CommentController')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOkResponse({ type: [CommentResponseDto] })
  public async findAll(): Promise<CommentResponseDto[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CommentResponseDto })
  public async findById(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CommentResponseDto })
  public async create(
    @UserDecorator() user: User,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.create({
      ...comment,
      userId: user.id,
    });
  }

  @Delete(':id')
  public async delete(@Res() response: Response, @Param('id') id: string) {
    await this.commentService.delete(id);
    return response.status(HttpStatus.OK).json({
      message: 'Comment has been deleted successfully',
    });
  }
}
