// import { Body, Controller, Post } from '@nestjs/common';
// import { SmsService } from './sms.service';

// @Controller()
// export class SmsController {
//   constructor(private readonly smsService: SmsService) {}

//   @Post('send-sms')
//   async sendSMS(@Body() body: { to: string; body: string; from?: string }) {
//     return await this.smsService.sendSMS(body.to, body.body, body.from);
//   }

//   @Post('view-history')
//   async viewHistory(
//     @Body() body: { from?: string; to?: string },
//   ): Promise<any> {
//     return await this.smsService.viewHistory(body.from, body.to);
//   }
// }
