import { BadRequestException, Body, Controller, Post,Req,Res,UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDTO } from 'src/DTO/admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe()) // validation using AdminLoginDTO
  async Login(@Body() admins: AdminLoginDTO, @Res() res): Promise<any>{
      const {access_token} = await this.authService.Login(admins);
      res.cookie('jwt', access_token, {
        httpOnly: true, // not accessible to Javascript on client side
        expires: new Date(Date.now() + 3600000), // 1 hour
        path: '/', // Accessible to entire project,
        sameSite: 'strict', // ensure cookie originating from the same site,
        secure: false // HTTP Secure (Need certificate)
      });
  
      return res.send({ message: 'Login successfull...' });
  }

  @Post('logout')
  async Logout(@Res() res, @Req() req): Promise<any> {
    res.clearCookie('jwt');
    return res.send({ message: 'Logout successfull...' });
  }
}