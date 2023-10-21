import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './validation.pipe';
import { corsConfig } from 'config';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || 'development';
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Recoco')
    .setDescription('Recoco API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  app.enableCors(corsConfig[environment]);
  await app.listen(port);
}
bootstrap();
