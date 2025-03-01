import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './constants/env.constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('APIs Blog')
    .setDescription('The blogs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.setGlobalPrefix('api');
  await app.listen(ENV.APP_PORT ?? 3000);
}
bootstrap();
