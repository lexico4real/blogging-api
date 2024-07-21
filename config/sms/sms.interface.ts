export default interface SMS {
  sendSMS(to: string, body: string, from?: string): any;

  viewHisory(from?: string, to?: string): any;
}
