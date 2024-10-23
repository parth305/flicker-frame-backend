import { Controller, Get } from '@nestjs/common';

@Controller({ version: '1' })
export class V1Controller {
  @Get()
  v1Hello(): string {
    return 'Welcome V1 APIs';
  }
}
