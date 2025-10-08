import { Comment } from './comment.entity';
import { LikeComment } from './like_comment.entity';
import { LikePost } from './like_post.entity';
import { Post } from './post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { enumData } from '../utils/constants';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  phone!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username!: string;

  @Column({ type: 'text', nullable: true })
  avatar!: string;

  @Column({ type: 'varchar', nullable: false })
  fullname!: string;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  phoneVerified!: boolean;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: enumData.code,
    default: enumData.code[1],
  })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  resetPwdToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPwdExpires: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'varchar', nullable: true })
  registerToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  registerExpires!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  otp!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Relations
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => LikePost, (likePost) => likePost.user)
  likePosts: LikePost[];

  @OneToMany(() => LikeComment, (likeComment) => likeComment.user)
  likeComments: LikeComment[];
}
