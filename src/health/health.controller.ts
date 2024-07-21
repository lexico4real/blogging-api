import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  HealthCheckService,
  // HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  // DiskHealthIndicator,
} from '@nestjs/terminus';
// import response from config/response.json
import { ResponseCode } from '../../common/response/responseCode';
import Logger from '../../config/log4js/logger';

const logger = new Logger();

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    // private http: HttpHealthIndicator,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    // private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  sspHealthCheck() {
    return this.healthCheckService.check([
      // () =>
      //   this.http.responseCheck(
      //     'ssp_health',
      //     'https://ssp.health/api/v1/getCurrentStatistics',
      //     (res) => res.status === 204,
      //   ),
      () => this.typeOrmHealthIndicator.pingCheck(process.env.DATABASE_NAME),
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 500 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 500 * 1024 * 1024),
      // () =>
      //   this.diskHealthIndicator.checkStorage('storage', {
      //     path: '/',
      //     thresholdPercent: 0.5,
      //   }),
    ]);
  }

  @Cron('45 * * * * *')
  async handleHealthCheckCron() {
    if (process.env.NODE_ENV === 'development') {
      try {
        if ((await this.sspHealthCheck()).status === 'error') {
          logger.log(
            'health',
            'critical',
            JSON.stringify(this.sspHealthCheck()) as any,
            'health-check-cron',
          );
        }
        logger.log(
          'health',
          'info',
          JSON.stringify({
            health: {
              healthStatus: 'ok',
              time: new Date(),
              type: 'health_check_cron',
              status: ResponseCode.SUCCESS,
            },
          }),
          'health-check-cron',
        );
      } catch (error) {
        logger.log(
          'health',
          'error',
          JSON.stringify({
            health: {
              healthStatus: 'error',
              time: new Date(),
              type: 'health_check_cron',
              status: ResponseCode.GATEWAY_TIMEOUT,
            },
          }),
          'health-check-cron',
        );
      }
    }
  }
}
