import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Public()
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      // add DB / Redis checks here
    ]);
  }

  @Public()
  @Get('ping')
  ping() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
