import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@/src/v1/posts/entities';
import { PostsControllerV1 } from '@/src/v1/posts/posts.controller';
import { PostsServiceV1 } from '@/src/v1/posts/posts.service';
import { UsersModule } from '@/src/v1/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule],
  controllers: [PostsControllerV1],
  providers: [PostsServiceV1],
})
export class PostsModule {}
