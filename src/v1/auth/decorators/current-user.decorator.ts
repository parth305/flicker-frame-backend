import { createParamDecorator } from '@nestjs/common';

import { ICurrentUser } from '@/src/common/interfaces/current-user.interface';

export const CurrentUser = createParamDecorator((_, req): ICurrentUser => {
  const request = req.switchToHttp().getRequest();
  console.log(request['user']);
  return {
    userEmail: request['user'].userEmail,
    userId: request['user'].id,
    userName: request['user'].userName,
  };
});
