import { Test, TestingModule } from '@nestjs/testing';

import { UsersServiceV1 } from '@/src/v1/users/users.service';

describe('UsersService', () => {
  let service: UsersServiceV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersServiceV1],
    }).compile();

    service = module.get<UsersServiceV1>(UsersServiceV1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
