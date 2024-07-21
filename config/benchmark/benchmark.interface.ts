export default interface IBenchmark {
  run(): Promise<void>;
}
