import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getBlank(): object {
    return this.appService.getBlank();
  }
  
  @Get('home')
  getHome(): object {
    return this.appService.getHome();
  }

  @Get('about')
  getAbout(): object {
    return this.appService.getAbout();
  }

  @Get('reg')
  getReg(): object {
    return this.appService.getReg();
  }
}
