import { enumData } from '../../../utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  phone!: string;

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
  role!: string;

  @Column({ type: 'varchar', nullable: true })
  resetPwdToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPwdExpires!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'varchar', nullable: true })
  registerToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  registerExpires!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
