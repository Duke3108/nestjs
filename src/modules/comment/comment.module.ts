import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'entities/comment.entity';
import { LikeComment } from 'entities/like_comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, LikeComment])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [TypeOrmModule],
})
export class CommentModule {}
