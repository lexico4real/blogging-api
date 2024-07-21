export default class MailOptions {
  public from: string;
  public to: string;
  public subject: string;
  public text: string;

  constructor(from: string, to: string, subject: string, text: string) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}
