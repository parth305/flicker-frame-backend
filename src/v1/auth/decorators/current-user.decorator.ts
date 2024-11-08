import { createParamDecorator } from '@nestjs/common';

import { ICurrentUser } from '@/src/common/interfaces/current-user.interface';

export const CurrentUser = createParamDecorator((type, req): ICurrentUser => {
  const request = req.switchToHttp().getRequest();
  if (type === 'google') {
    return {
      userEmail: request['user'].email,
      userId: request['user'].id,
      userName: request['user'].userName,
    };
  }
  return {
    userEmail: request['user'].userEmail,
    userId: request['user'].id,
    userName: request['user'].userName,
  };
});
