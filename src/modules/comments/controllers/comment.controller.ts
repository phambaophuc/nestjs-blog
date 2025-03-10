import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { CommentResponseDto } from '../dtos/comment-response.dto';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

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
    @Req() req: Request,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.create({
      ...comment,
      authorId: req['user'].id,
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
