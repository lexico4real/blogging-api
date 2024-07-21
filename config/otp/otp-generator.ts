import * as speakeasy from 'speakeasy';

let time = 60;
let countdown: any;
export default class OtpGenerator {
  updateTime() {
    const min = Math.floor(time / 60);
    let sec: any = time % 60;
    sec = sec < 10 ? '0' + sec : sec;
    console.log(`${min}:${sec}`);
    time--;
    if (min == 0 && sec == 0) clearInterval(countdown);
  }
  generateOtp(secret: string): any {
    const token = speakeasy.totp({
      secret,
      encoding: 'base32',
      step: 60,
    });
    return { token };
  }
}
