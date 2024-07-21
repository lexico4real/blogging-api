import 'dotenv/config';

export default class Credentials {
  public static readonly email = process.env.EMAIL_ADDRESS;
  public static readonly password = process.env.EMAIL_PASSWORD;
  // public static readonly port = process.env.PORT;
  public static readonly mailServer = process.env.EMAIL_SERVER;
}
