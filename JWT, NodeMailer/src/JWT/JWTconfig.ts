import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './jwtSecret';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [JwtModule],
})
export class JWTConfig {}
