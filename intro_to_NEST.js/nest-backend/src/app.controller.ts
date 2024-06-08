import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // no controller route
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home') // only action route present here
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
