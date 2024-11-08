import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import { IPaginationParams } from '@/src/common/interfaces';
import { ICurrentUser } from '@/src/common/interfaces/current-user.interface';
import { hashPassword } from '@/src/helpers';
import {
  ConditionUserDtoV1,
  CreateUserDtoV1,
  UpdateUserDtoV1,
} from '@/src/v1/users/dto';
import { User } from '@/src/v1/users/entities/user.entity';

import { CreateUserInfoV1 } from './dto/create-user-info.dto';
import { UserInfo } from './entities/user-info.entity';

@Injectable()
export class UsersServiceV1 {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private usersInfoRepository: Repository<UserInfo>,
  ) {}

  async create(createUserDto: CreateUserDtoV1) {
    try {
      const { userName, userEmail, userPassword } = createUserDto;
      const isEmailAlreadyPresent = await this.exists({
        userEmail,
      });
      if (isEmailAlreadyPresent) {
        throw new BadRequestException(
          'User is already registered with same email',
        );
      }
      const isUserNameAlreadyPresent = await this.exists({
        userName,
      });
      if (isUserNameAlreadyPresent) {
        throw new BadRequestException(
          'User is already registered with same username',
        );
      }
      createUserDto.userPassword = await hashPassword(userPassword);
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      return user;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(
    conditions: ConditionUserDtoV1 = {},
    pagination: IPaginationParams = {},
  ) {
    try {
      // add total count in response
      const [users, count] = await this.usersRepository.findAndCount({
        where: conditions,
        order: { id: 'ASC' },
        skip: pagination.offset,
        take: pagination.limit,
      });
      return { users, count };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(
    conditions: ConditionUserDtoV1,
    select: FindOptionsSelect<User> = {},
  ) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: conditions,
        select,
      });
      return user;
    } catch (err) {
      throw new NotFoundException('Invalid data');
    }
  }

  async update(conditions: ConditionUserDtoV1, updateUserDto: UpdateUserDtoV1) {
    try {
      if (updateUserDto.userPassword) {
        updateUserDto.userPassword = await hashPassword(
          updateUserDto.userPassword,
        );
      }
      const updatedRes = await this.usersRepository.update(
        conditions,
        updateUserDto,
      );
      if (!updatedRes.affected) {
        throw new NotFoundException('Invalid user');
      }
      const data = await this.findAll(conditions);
      return data.users;
    } catch (err) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(conditions: ConditionUserDtoV1) {
    try {
      const { users, count } = await this.findAll(conditions);
      if (!count) {
        throw new NotFoundException('Invalid user');
      }
      const deletedUsers = await this.usersRepository.remove(users);
      return deletedUsers;
    } catch (err) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async exists(conditions: ConditionUserDtoV1) {
    const isExists = await this.usersRepository.existsBy(conditions);
    return isExists;
  }

  async addUserInfo(currentUser: ICurrentUser, userInfo: CreateUserInfoV1) {
    try {
      const userId = currentUser.userId;
      const userPrimaryDetails = await this.usersRepository.findOneByOrFail({
        id: userId,
      });
      const createdUserInfo = this.usersInfoRepository.create(userInfo);
      createdUserInfo.user = userPrimaryDetails;
      await this.usersInfoRepository.upsert(createdUserInfo, ['user']);
      const { user, ...rest } = createdUserInfo;
      return rest;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }

  async getUserInfo(currentUser: ICurrentUser) {
    try {
      const userId = currentUser.userId;
      const userInfo = await this.usersInfoRepository.findOneByOrFail({
        user: { id: userId },
      });
      return userInfo;
    } catch (err) {
      throw new BadRequestException('User Info Is Empty For Current User');
    }
  }
}
