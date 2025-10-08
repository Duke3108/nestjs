import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GenericRepository } from 'repositories/genericRepository';
import { Post } from 'entities/post.entity';
import { EntityManager, IsNull, Not } from 'typeorm';
import Helper from 'utils/helper';
import { LikePost } from 'entities/like_post.entity';

@Injectable()
export class PostService {
  private readonly postRepository: GenericRepository<Post>;
  private readonly likePostRepository: GenericRepository<LikePost>;

  constructor(manager: EntityManager) {
    this.postRepository = new GenericRepository(Post, manager);
    this.likePostRepository = new GenericRepository(LikePost, manager);
  }

  async create(
    uid: number,
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ) {
    return await this.postRepository.create({
      ...createPostDto,
      slug: Helper.makeSlugFromString(
        createPostDto.title + Math.floor(Math.random() * 10000),
      ),
      img: files?.map((file) => file.path) || [],
      category: { id: createPostDto.categoryId },
      user: { id: uid },
    });
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findById(id, undefined, [
      'category',
      'user',
      'likes.user',
      'comments',
    ]);
    if (!post) throw new BadRequestException('Post not found');
    return { likeCount: post.likes?.length || 0, ...post };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await this.postRepository.delete(id);
  }

  async hidePost(id: number) {
    await this.postRepository.softDelete(id, 'Không tìm thấy bài viết');
    return { message: 'Đã ẩn bài viết' };
  }

  async activePost(id: number) {
    const post = await this.postRepository.getRepository().findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!post) throw new BadRequestException('Bài viết không tồn tại');
    await this.postRepository.getRepository().restore(id);
    return { message: 'Đã hiện bài viết' };
  }

  async likePost(id: number, uid: number) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new BadRequestException('Bài viết không tồn tại');
    }
    await this.likePostRepository.create({
      post: { id: post.id },
      user: { id: uid },
    });
    return { message: 'bạn đã like bài viết số ' + post.id };
  }

  async unlikePost(id: number, uid: number) {
    const post = await this.postRepository.findById(id);
    if (!post) throw new BadRequestException('Bài viết không tồn tại');
    const likePost = await this.likePostRepository.findOne({
      where: { post: { id: post.id }, user: { id: uid } },
    });
    if (!likePost) throw new BadRequestException('Like bài viết không tồn tại');
    await this.likePostRepository.delete(likePost.id);
    return { message: 'bạn đã unlike bài viết số ' + post.id };
  }
}
