import { Module } from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { PostCategoryController } from './post-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from '../../entities/post_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
  exports: [TypeOrmModule],
})
export class PostCategoryModule {}
