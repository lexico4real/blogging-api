import * as speakeasy from 'speakeasy';

export default class OtpValidator {
  validateOtp(secret: string, otp: string): any {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      step: 60,
      window: 0,
    });
    console.log({ verified });
    return { verified };
  }
}
