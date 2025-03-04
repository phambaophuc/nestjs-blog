import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SubscribersService } from '../services/subscribers.service';
import { Response } from 'express';
import { SubscribeDto } from '../dtos/subscribe-dto';

@ApiTags('SubscriberController')
@Controller('subscribers')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscribersService) {}

  @Post('subscribe')
  @ApiBody({ type: SubscribeDto })
  public async subscribe(
    @Res() response: Response,
    @Body('email') email: string,
  ) {
    await this.subscriberService.subscribe(email);
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Registered successfully!' });
  }

  @Post('unsubscribe')
  @ApiBody({ type: SubscribeDto })
  public async unsubscribe(
    @Res() response: Response,
    @Body('email') email: string,
  ) {
    await this.subscriberService.unsubscribe(email);
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Unsubscribe successfully!' });
  }
}
