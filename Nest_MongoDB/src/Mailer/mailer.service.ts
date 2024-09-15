import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, content: string, noReply: boolean = false, isHtml: boolean = false): Promise<void> {
    try {
      const from = noReply ? '"No Reply" <no-reply-error40.u@gmail.com>' : '"Tech World" <error40.u@gmail.com>';
      const replyTo = noReply ? undefined : '"Tech World" <reply-error40.u@gmail.com>';

      await this.mailerService.sendMail({
        from,
        to,
        subject,
        [isHtml ? 'html' : 'text']: content,
        replyTo,
      });
    } catch (error) {
      throw new BadRequestException('Failed to send email.');
    }
  }
}
