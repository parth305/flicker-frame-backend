import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Serializer } from '@/src/common/decorators';
import { IPaginationRes, IResponse } from '@/src/common/interfaces';
import { ICurrentUser } from '@/src/common/interfaces/current-user.interface';
import { AuthenticationV1 } from '@/src/v1/auth/decorators';
import {
  QueryParamsUserDtoV1,
  ResUserDtoV1,
  CreateUserDtoV1,
  UpdateUserDtoV1,
} from '@/src/v1/users/dto';
import { User } from '@/src/v1/users/entities/user.entity';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

import { CreateUserInfoV1 } from './dto/create-user-info.dto';
import { ResUserInfoDtoV1 } from './dto/res-user-info';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuardV1 } from '../auth/guards';

@Serializer(ResUserDtoV1)
@AuthenticationV1() // Authentication decorator
@Controller({ path: 'users', version: '1' })
// @UseInterceptors(CacheInterceptor) // Only GET endpoints are cached
export class UsersControllerV1 {
  constructor(private readonly usersService: UsersServiceV1) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDtoV1,
  ): Promise<IResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    return {
      data: user,
      message: 'User created successfully',
    };
  }

  @Get()
  async findAll(
    @Query() query: QueryParamsUserDtoV1,
  ): Promise<IPaginationRes<User>> {
    const { offset = 0, limit = 10, ...conditions } = query;
    const { users, count } = await this.usersService.findAll(conditions, {
      limit,
      offset,
    });
    return {
      data: users,
      message: 'All Users fetched successfully',
      meta: {
        count,
      },
    };
  }

  @Get(':id') // no Authorization applied
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<User>> {
    const user = await this.usersService.findOne({ id });
    return { data: user, message: 'User fetched successfully' };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDtoV1,
  ): Promise<IResponse<User>> {
    const updatedUser = await this.usersService.update({ id }, updateUserDto);
    return { data: updatedUser, message: 'User updated successfully' };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<User>> {
    const deletedUser = await this.usersService.remove({ id });
    return { data: deletedUser, message: 'User deleted successfully' };
  }

  @UseGuards(AuthGuardV1)
  @Post('/userInfo/me')
  async addUserInfo(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() createUserInfo: CreateUserInfoV1,
  ): Promise<IResponse<ResUserInfoDtoV1>> {
    console.log(currentUser);
    const userInfo = await this.usersService.addUserInfo(
      currentUser,
      createUserInfo,
    );
    return { data: userInfo, message: 'UserInfo Added Successfully' };
  }

  @UseGuards(AuthGuardV1)
  @Get('/userInfo/me')
  async getUserInfo(@CurrentUser() currentUser: ICurrentUser) {
    console.log(currentUser);
    const userInfo = await this.usersService.getUserInfo(currentUser);
    return userInfo;
  }
}
