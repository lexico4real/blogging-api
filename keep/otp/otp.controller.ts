// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { OtpService } from './otp.service';

// @Controller()
// export class OtpController {
//   constructor(private readonly otpService: OtpService) {}

//   @Get('token')
//   async generateToken(): Promise<any> {
//     return await this.otpService.generateToken();
//   }

//   @Post('validate-token')
//   async validateToken(
//     @Body('secret') secret: string,
//     @Body('token') token: string,
//   ): Promise<boolean> {
//     return await this.otpService.validateToken(secret, token);
//   }
// }
