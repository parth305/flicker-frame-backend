import { Exclude } from 'class-transformer';

import { LoginAuthDtoV1 } from '@/src/v1/auth/dto';

export class ResLoginDtoV1 extends LoginAuthDtoV1 {
  id: string;
  userEmail: string;
  accessToken: string;
  userName: string;
  isUserInfoExists: boolean;
  isEmailVerified: boolean;
  userInfo: {
    firstName: string;
    lastName: string;
    dob: Date;
    userProfilePicUri: string;
  };

  @Exclude()
  userPassword: string;
}
