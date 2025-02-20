import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './constants/env.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(ENV.APP_PORT ?? 3000);
}
void bootstrap();
