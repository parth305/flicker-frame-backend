import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities';
@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  //   TODO : Move This Fields to A Base Extendable Class.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @ManyToOne((_type) => User, (user) => user.userInfo)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
