import { createParamDecorator } from '@nestjs/common';

import { ICurrentUser } from '@/src/common/interfaces/current-user.interface';

export const CurrentUser = createParamDecorator((type, req): ICurrentUser => {
  const request = req.switchToHttp().getRequest();
  if (type === 'google') {
    console.log(request['user']);
    return {
      userEmail: request['user'].email,
      firstName: request['user'].firstName,
      lastName: request['user'].lastName,
      dob: request['user'].birthday,
    };
  }
  return {
    userEmail: request['user'].userEmail,
    userId: request['user'].id,
    userName: request['user'].userName,
  };
});
