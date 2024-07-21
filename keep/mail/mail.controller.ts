// import { Body, Controller, Post } from '@nestjs/common';
// import { MailService } from './mail.service';

// @Controller()
// export class mailController {
//   constructor(private readonly mailService: MailService) {}

//   @Post()
//   async sendMessage(
//     @Body('email') email: string,
//     @Body('name') name: string,
//     @Body('subject') subject: string,
//     @Body('description') description: string,
//   ): Promise<any> {
//     return await this.mailService.sendMessage(email, name, subject, description);
//   }
// }
