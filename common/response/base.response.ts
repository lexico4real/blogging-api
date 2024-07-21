export default class BaseResponse {
  public status: number;
  public message: string;
  public data: any;
  public length?: number;
  public time?: Date;

  constructor(
    status: number,
    message: string,
    data: any,
    length?: number,
    time?: Date,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.length = length;
    this.time = time;
  }

  async success(): Promise<any> {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      length: this.length,
      time: this.time,
    };
  }

  async error(): Promise<any> {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      time: this.time,
    };
  }
}
