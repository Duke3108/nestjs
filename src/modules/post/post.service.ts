import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GenericRepository } from 'repositories/genericRepository';
import { Post } from 'entities/post.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostService {
  private readonly postRepository: GenericRepository<Post>;

  constructor(manager: EntityManager) {
    this.postRepository = new GenericRepository(Post, manager);
  }

  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.create(createPostDto);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    return await this.postRepository.findById(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await this.postRepository.delete(id);
  }
}
