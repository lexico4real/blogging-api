import 'dotenv/config';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.MESSAGING_SERVICE_SID;
const senderNumber = process.env.TWILIO_PHONE_NUMBER;
import * as $ from 'twilio';
import SMS from './sms.interface';
const client = new $.Twilio(accountSid, authToken);

export default class SMSUtil implements SMS {
  viewHisory = async (from?: string, to?: string): Promise<any> => {
    try {
      const messages = await client.messages.list({
        from: from || senderNumber,
        to: to,
      });
      return messages;
    } catch (error) {
      console.log(error);
    }
  };

  sendSMS = async (to: string, body: string, from?: string): Promise<any> => {
    console.log('Sending SMS to ' + to);
    const message = await client.messages.create({
      body: body,
      messagingServiceSid: messagingServiceSid,
      from: from || senderNumber,
      to: to,
    });
    console.log({ message });
    const {
      body: messageBody,
      from: _senderNumber,
      to: receiverNumber,
      status,
      dateCreated: sentDate,
    } = message;
    return {
      messageBody,
      _senderNumber,
      receiverNumber,
      status,
      sentDate,
    };
  };
}
