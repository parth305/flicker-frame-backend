import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from '@/src/v1/addresses/entities';
import { EUsersRole } from '@/src/v1/users/types/user.type';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(2, {
    message: 'userName must be longer than or equal to 2 characters',
  })
  userName: string;

  @Column({ unique: true, nullable: false, update: false }) // default nullable is false
  @IsEmail(undefined, { message: 'userEmail must be an email' })
  userEmail: string;

  @Column()
  @MinLength(5, {
    message: 'userPassword must be longer than or equal to 5 characters',
  })
  @IsNotEmpty({ message: 'userPassword should not be empty' })
  userPassword: string;

  @Column({ type: 'enum', enum: EUsersRole, default: EUsersRole.USER })
  @IsNotEmpty({ message: 'userRole should not be empty' })
  @IsEnum(EUsersRole, { message: 'Invalid userRole' })
  userRole: EUsersRole;

  @OneToOne((_type) => Address, (address) => address.user)
  address: Address;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
