import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'entities/post.entity';
import { LikePost } from 'entities/like_post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, LikePost])],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule],
})
export class PostModule {}
