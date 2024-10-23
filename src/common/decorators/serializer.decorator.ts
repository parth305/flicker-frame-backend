import { UseInterceptors } from '@nestjs/common';

import { SerializeInterceptor } from '@/src/common/interceptors';

export function Serializer(schema: any) {
  return UseInterceptors(new SerializeInterceptor(schema));
}
