export default interface IMain {
  main(
    email: string,
    name: string,
    subject: string,
    description: string,
  ): Promise<any>;
}
