import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getBlank(): object {
    return {message : 'Blank Route From App Controller!'};
  }
  
  getHome(): object {
    return {message:'This is App Home Page -- info : App Controller, getHome() Action'};
  }

  getAbout(): object {
    return {message:'This is About Page -- info : App Controller, getAbout() Action'};
  }

  getReg(): object {
    return {message:'This is Registration Page -- info : App Controller, getReg() Action'};
  }
}
