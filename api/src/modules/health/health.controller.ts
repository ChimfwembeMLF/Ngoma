import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('api/v1/health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'Ngoma API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }
}
