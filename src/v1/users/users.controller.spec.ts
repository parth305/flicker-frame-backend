import { Test, TestingModule } from '@nestjs/testing';

import { UsersControllerV1 } from '@/src/v1/users/users.controller';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

describe('UsersController', () => {
  let controller: UsersControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersControllerV1],
      providers: [UsersServiceV1],
    }).compile();

    controller = module.get<UsersControllerV1>(UsersControllerV1);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
