import { Body, Controller, Post } from '@nestjs/common';
import { MMailerService } from './mailer.service';

@Controller()
export class MailerController {
  constructor(private readonly mails: MMailerService) {}
}
