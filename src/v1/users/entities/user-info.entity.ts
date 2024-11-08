import { Exclude } from 'class-transformer';
import { IsDateString, IsNotEmpty } from 'class-validator';
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
  @IsNotEmpty({ message: 'First Name Can not be empty' })
  firstName: string;

  @Column({
    type: 'varchar',
    length: CONSTANTS.USERS.USER_FIRST_NAME_MAX_LENGTH,
    nullable: true,
  })
  lastName: string;

  @Column({ nullable: true })
  userBio: string;

  @Column({ nullable: false })
  @IsNotEmpty({ message: 'DOB Should Not Be empty' })
  @IsDateString()
  dob: Date;

  @Column({ nullable: true })
  userProfilePicUri: string;

  //   TODO : Move This Fields to A Base Extendable Class.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @OneToOne((_type) => User, (user) => user.userInfo)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
