import { Injectable } from '@nestjs/common';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { GenericRepository } from '../../repositories/genericRepository';
import { PostCategory } from '../../entities/post_category.entity';
import { EntityManager } from 'typeorm';
import Helper from 'utils/helper';
import { CustomQuery } from 'common/types/query.type';

@Injectable()
export class PostCategoryService {
  private readonly postCategoryRepository: GenericRepository<PostCategory>;

  constructor(manager: EntityManager) {
    this.postCategoryRepository = new GenericRepository(PostCategory, manager);
  }

  async create(createPostCategoryDto: CreatePostCategoryDto) {
    return await this.postCategoryRepository.create({
      ...createPostCategoryDto,
      slug: Helper.makeSlugFromString(createPostCategoryDto.name),
    });
  }

  async findAll(query: CustomQuery<PostCategory>) {
    return await this.postCategoryRepository.findMany(query);
  }

  async findOne(id: number) {
    return await this.postCategoryRepository.findById(id);
  }

  async update(id: number, updatePostCategoryDto: UpdatePostCategoryDto) {
    return await this.postCategoryRepository.update(id, {
      ...updatePostCategoryDto,
      slug: Helper.makeSlugFromString(updatePostCategoryDto.name!),
    });
  }

  async remove(id: number) {
    return await this.postCategoryRepository.delete(id);
  }
}
