import { BadRequestException, Body, Controller, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/DTO/login.dto';
import { SIgnUpDTO } from 'src/DTO/signup.dto';
import { resetPassDTO } from 'src/DTO/resetPass.dto';
import { genResDTO } from 'src/DTO/generateReset.dto';
import { encrypt } from 'src/Utils/crypto.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async Login(@Body() users: LoginDTO, @Res() res: any): Promise<any> {
    const { access_token } = await this.authService.Login(users);

    const encryptedToken = encrypt(access_token);

    res.cookie('jwt', encryptedToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
      path: '/',
      sameSite: 'strict',
      secure: false
    });

    return res.send({ message: 'Login successful...' });
  }

  @Post('logout')
  async Logout(@Res() res, @Req() req): Promise<any> {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          throw new BadRequestException("Session not cleared!");
        }
        res.clearCookie('jwt');
        return res.send({ message: 'Logout successful...' });
      });
    } else {
      res.clearCookie('jwt');
      return res.send({ message: 'Logout successful...' });
    }
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async SignUP(@Body() users: SIgnUpDTO): Promise<any> {
    return this.authService.SignUP(users);
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPass: resetPassDTO
  ): Promise<void> {
    await this.authService.resetPassword(resetPass, token);
  }

  @Post('reset-request')
  @UsePipes(new ValidationPipe())
  async generateResetCode(
    @Body() resEmail: genResDTO
  ): Promise<any> {
    return await this.authService.generateResetCode(resEmail);
  }
}