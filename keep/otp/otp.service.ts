// import { Injectable } from '@nestjs/common';
// import OtpGenerator from 'common/otp/otp-generator';
// import OtpValidator from 'common/otp/otp-validator';
// import SecretGenerator from 'common/otp/secret-generator';

// @Injectable()
// export class OtpService {
//   constructor(
//     private readonly secret: SecretGenerator,
//     private readonly otp: OtpGenerator,
//     private readonly otpValidator: OtpValidator,
//   ) {}

//   async generateToken(): Promise<any> {
//     const secret = this.secret.generate().base32;
//     const otp = this.otp.generateOtp(secret);
//     return { secret, ...otp };
//   }

//   async validateToken(secret: string, token: string): Promise<any> {
//     const result = this.otpValidator.validateOtp(secret, token);
//     return result;
//   }
// }
