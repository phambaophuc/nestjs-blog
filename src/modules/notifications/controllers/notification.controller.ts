import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationService } from '../services/notification.service';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async create(
    @Body() dto: CreateNotificationDto,
    @Request() req: Request,
  ) {
    return this.service.create({
      ...dto,
      userId: req['user'].id,
    });
  }

  @Get()
  public async getByUser(@Query('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Patch(':id/read')
  public async markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}
