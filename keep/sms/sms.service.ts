// import { Injectable } from '@nestjs/common';
// import SMSUtil from '../../common/sms/sms.util';

// @Injectable()
// export class SmsService {
//   constructor(private readonly smsUtil: SMSUtil) {}

//   async sendSMS(to: string, body: string, from?: string): Promise<any> {
//     try {
//       return await this.smsUtil.sendSMS(to, body, from);
//     } catch (error) {
//       return error;
//     }
//   }

//   async viewHistory(from?: string, to?: string): Promise<any> {
//     try {
//       return await this.smsUtil.viewHisory(from, to);
//     } catch (error) {
//       return error;
//     }
//   }
// }
