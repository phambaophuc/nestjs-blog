import { Module } from '@nestjs/common';

import { HtmlUtilsService } from './html-utils.service';

@Module({
  providers: [HtmlUtilsService],
  exports: [HtmlUtilsService],
})
export class HtmlUtilsModule {}
