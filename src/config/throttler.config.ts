import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: 1000,
    limit: 10,
  },
  {
    name: 'medium',
    ttl: 5000,
    limit: 100,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 250,
  },
] as const;
