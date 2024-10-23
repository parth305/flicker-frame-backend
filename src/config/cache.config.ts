import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

import { ENV_VARIABLES } from '@/src/config';

export const cacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: ENV_VARIABLES.REDIS_HOST,
        port: ENV_VARIABLES.REDIS_PORT,
      },
      ttl: ENV_VARIABLES.REDIS_DEFAULT_TTL,
    });
    return {
      store,
    };
  },
} as const;
