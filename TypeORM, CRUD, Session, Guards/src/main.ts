import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'SHAMIM-23!@#', // Replace with a strong secret key
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // Session will last for 1 hour
      },
    }),
  );

  await app.listen(3001);
}
bootstrap();
