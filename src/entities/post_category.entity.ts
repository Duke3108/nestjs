import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('PostCategories')
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string;

  @Column({ unique: true, type: 'varchar', nullable: false })
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
