import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('PostCategories')
export class PostCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: 'varchar', nullable: false })
  name!: string;

  @Column({ unique: true, type: 'varchar', nullable: false })
  slug!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
