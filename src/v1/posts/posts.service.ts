import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

import { IPaginationParams } from '@/src/common/interfaces';
import {
  ConditionPostDtoV1,
  CreatePostDtoV1,
  UpdatePostDtoV1,
} from '@/src/v1/posts/dto';
import { Post } from '@/src/v1/posts/entities';
import { User } from '@/src/v1/users/entities/user.entity';

@Injectable()
export class PostsServiceV1 {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDtoV1, user: User) {
    try {
      const post = this.postsRepository.create({ ...createPostDto, user });
      await this.postsRepository.save(post);
      return post;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(
    conditions: ConditionPostDtoV1 = {},
    pagination: IPaginationParams = {},
  ) {
    try {
      const [posts, count] = await this.postsRepository.findAndCount({
        where: conditions as FindOptionsWhere<Post> | FindOptionsWhere<Post>[], // don't follow this approach it is patch
        order: { id: 'ASC' },
        skip: pagination.offset,
        take: pagination.limit,
      });
      return { posts, count };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(
    conditions: ConditionPostDtoV1,
    select: FindOptionsSelect<Post> = {},
  ) {
    try {
      const post = await this.postsRepository.findOneOrFail({
        where: conditions as FindOptionsWhere<Post> | FindOptionsWhere<Post>[],
        relations: {
          user: true,
        },
        select,
      });
      return post;
    } catch (err) {
      throw new NotFoundException('Invalid data');
    }
  }

  async update(conditions: ConditionPostDtoV1, updatePostDto: UpdatePostDtoV1) {
    try {
      const updatedRes = await this.postsRepository.update(
        conditions as unknown as FindOptionsWhere<Post>,
        updatePostDto,
      );
      if (!updatedRes.affected) {
        throw new NotFoundException('Invalid post');
      }
      const data = await this.findAll(conditions);
      return data.posts;
    } catch (err) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(conditions: ConditionPostDtoV1) {
    try {
      const { posts, count } = await this.findAll(conditions);
      if (!count) {
        throw new NotFoundException('Invalid posts');
      }
      const deletedPosts = await this.postsRepository.remove(posts);
      return deletedPosts;
    } catch (err) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
