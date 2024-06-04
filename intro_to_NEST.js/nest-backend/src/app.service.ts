import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): object {
    return {message : 'This is Home Page'};
  }

  getAbout(): object {
    return {message : 'This is About Page'};
  }

  getReg(): object {
    return {message : 'This is Registration Page'};
  }
}
