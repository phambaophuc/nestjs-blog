import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty()
  email: string;
}
