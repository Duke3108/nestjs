import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GenericRepository } from 'repositories/genericRepository';
import { Comment } from 'entities/comment.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CommentService {
  private readonly commentRepository: GenericRepository<Comment>;

  constructor(manager: EntityManager) {
    this.commentRepository = new GenericRepository(Comment, manager);
  }

  async create(createCommentDto: CreateCommentDto) {
    return await this.commentRepository.create(createCommentDto);
  }

  async findAll() {
    return await this.commentRepository.find();
  }

  async findOne(id: number) {
    return await this.commentRepository.findById(id);
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number) {
    return await this.commentRepository.delete(id);
  }
}
