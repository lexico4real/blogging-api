import notifier from 'node-notifier';
import path from 'path';

export default class BaseNotification {
  topic: string;
  message: string;
  icon: string;
  messageObject: any;
  constructor(
    topic: string,
    message: string,
    icon: string,
    messageObject?: any,
  ) {
    this.topic = topic;
    this.message = message;
    this.icon = icon;
    this.messageObject = messageObject;
  }

  getTopic(): string {
    return this.topic;
  }

  getMessage(): string {
    return this.message;
  }

  getIcon(): string {
    return this.icon;
  }

  getMessageObject(): any {
    return this.messageObject;
  }

  setMessageObject(messageObject: any): void {
    this.messageObject = messageObject;
  }

  setTopic(topic: string): void {
    this.topic = topic;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  setIcon(icon: string): void {
    this.icon = icon;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  createMessage(): void {
    notifier.notify({
      title: this.getTopic(),
      message: this.getMessage(),
      icon: path.join(__dirname, this.getIcon()),
      sound: true,
      wait: true,
    });
  }
}
