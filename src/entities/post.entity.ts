import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PostCategory } from './post_category.entity';
import { Comment } from './comment.entity';
import { LikePost } from './like_post.entity';

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title!: string;

  @Column({ unique: true, type: 'varchar', nullable: false })
  slug!: string;

  @Column({ type: 'text', nullable: false })
  desc!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column({ type: 'simple-json', nullable: true })
  img!: string[];

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status!: string;

  @Column({ type: 'boolean', default: false })
  is_featured!: boolean;

  @Column({ type: 'integer', default: 0 })
  views!: number;

  @Column({ type: 'timestamp', nullable: true })
  published_at?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Relations

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => PostCategory, (category) => category.posts, {
    onDelete: 'SET NULL',
  })
  category: PostCategory;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => LikePost, (likePost) => likePost.post)
  likes: LikePost[];
}
