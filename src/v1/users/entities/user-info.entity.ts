import { Exclude } from 'class-transformer';
import { MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CONSTANTS } from '@/src/constants/common.constant';

import { User } from './user.entity';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: CONSTANTS.USERS.USER_FIRST_NAME_MAX_LENGTH,
  })
  @MinLength(2, {
    message: 'First Name must be longer than or equal to 2 characters',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: CONSTANTS.USERS.USER_FIRST_NAME_MAX_LENGTH,
  })
  lastName: string;

  @Column()
  userBio: string;

  @Column({ nullable: false })
  dob: Date;

  @Column()
  userProfilePicUri: string;

  //   TODO : Move This Fields to A Base Extendable Class.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({})
  @OneToOne((_type) => User, (user) => user.userInfo)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
