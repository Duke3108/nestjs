import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GenericRepository } from 'repositories/genericRepository';
import { Comment } from 'entities/comment.entity';
import { EntityManager, IsNull, Not } from 'typeorm';
import { LikeComment } from 'entities/like_comment.entity';

@Injectable()
export class CommentService {
  private readonly commentRepository: GenericRepository<Comment>;
  private readonly likeCommentRepository: GenericRepository<LikeComment>;

  constructor(manager: EntityManager) {
    this.commentRepository = new GenericRepository(Comment, manager);
    this.likeCommentRepository = new GenericRepository(LikeComment, manager);
  }

  async create(
    createCommentDto: CreateCommentDto,
    uid: number,
    postId: number,
  ) {
    return await this.commentRepository.create({
      ...createCommentDto,
      user: { id: uid },
      post: { id: postId },
    });
  }

  async findAll() {
    return await this.commentRepository.find();
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findById(id, undefined, [
      'user',
      'post',
      'likes',
      'likes.user',
    ]);
    if (!comment) throw new BadRequestException('Comment not found');
    return { likeCount: comment.likes?.length || 0, ...comment };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async hideComment(id: number) {
    await this.commentRepository.softDelete(id, 'Không tìm thấy bình luận');
    return { message: 'Đã ẩn bình luận' };
  }

  async activeComment(id: number) {
    const comment = await this.commentRepository.getRepository().findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!comment) throw new BadRequestException('Không tìm thấy bình luận');
    await this.commentRepository.getRepository().restore(id);
    return { message: 'Đã hiện bình luận' };
  }

  async remove(id: number) {
    return await this.commentRepository.delete(id);
  }

  async likeComment(id: number, uid: number) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new BadRequestException('Không tìm thấy bình luận');
    }
    await this.likeCommentRepository.create({
      comment: { id: comment.id },
      user: { id: uid },
    });
    return { message: 'bạn đã like bình luận số ' + comment.id };
  }

  async unlikeComment(id: number, uid: number) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new BadRequestException('Không tìm thấy bình luận');
    const likeComment = await this.likeCommentRepository.findOne({
      where: { comment: { id: comment.id }, user: { id: uid } },
    });
    if (!likeComment)
      throw new BadRequestException('Like bình luận không tồn tại');
    await this.likeCommentRepository.delete(likeComment.id);
    return { message: 'bạn đã unlike bình luận số ' + comment.id };
  }
}
