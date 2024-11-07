import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { Serializer } from '@/src/common/decorators';
import { IPaginationRes, IResponse } from '@/src/common/interfaces';
import { AuthenticationV1 } from '@/src/v1/auth/decorators';
import {
  CreatePostDtoV1,
  QueryParamsPostDtoV1,
  ResPostDtoV1,
  UpdatePostDtoV1,
} from '@/src/v1/posts/dto';
import { Post as PostEntity } from '@/src/v1/posts/entities';
import { PostsServiceV1 } from '@/src/v1/posts/posts.service';
import { User } from '@/src/v1/users/entities';

@Serializer(ResPostDtoV1)
@AuthenticationV1()
@Controller({ path: 'posts', version: '1' })
export class PostsControllerV1 {
  constructor(private readonly postsService: PostsServiceV1) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createPostDto: CreatePostDtoV1,
  ): Promise<IResponse<PostEntity>> {
    const user: User = req['user'];
    const post = await this.postsService.create(createPostDto, user);
    return {
      data: post,
      message: 'post created successfully',
    };
  }

  @Get()
  async findAll(
    @Query() query: QueryParamsPostDtoV1,
  ): Promise<IPaginationRes<PostEntity>> {
    const { offset = 0, limit = 10, ...conditions } = query;
    const { posts, count } = await this.postsService.findAll(conditions, {
      limit,
      offset,
    });
    return {
      data: posts,
      message: 'posts fetched successfully',
      meta: {
        count,
      },
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<PostEntity>> {
    const post = await this.postsService.findOne({ id });
    return { data: post, message: 'post fetched successfully' };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDtoV1,
  ): Promise<IResponse<PostEntity>> {
    const updatedPost = await this.postsService.update({ id }, updatePostDto);
    return { data: updatedPost, message: 'post updated successfully' };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<PostEntity>> {
    const deletedPost = await this.postsService.remove({ id });
    return { data: deletedPost, message: 'post deleted successfully' };
  }
}
