import * as autocannon from 'autocannon';
import IBenchmark from './benchmark.interface';

export default class Benchmark {
  constructor(private readonly benchmark: IBenchmark) {}
  public async run(
    url: string,
    connections: number,
    pipelining: number,
    duration: number,
    workers: number,
  ): Promise<any> {
    const result = await this.benchmark.run();
    autocannon(
      {
        url,
        connections: connections || 10,
        pipelining: pipelining || 1,
        duration: duration || 10,
        workers: workers || 1,
      },
      console.log,
    );
    console.log(result);
  }
}
