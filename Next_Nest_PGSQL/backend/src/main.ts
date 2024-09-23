import * as dotenv from 'dotenv';
dotenv.config();
// import { join } from 'path';
// dotenv.config({ path: join(__dirname, '../../.env') });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.FRONTEND_DOMAIN, // frontend URL
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // cookie will last for 1 hour
      },
    }),
  );

  app.use(cookieParser());
  await app.listen(process.env.BACKEND_LISTEN || 3001);
}
bootstrap();
