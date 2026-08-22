/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SanitizeHtmlPipe } from './common/pipes/sanitize-html.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  // Always allow common local dev ports
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  const allOrigins = [...new Set([...allowedOrigins, ...devOrigins])];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new SanitizeHtmlPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
