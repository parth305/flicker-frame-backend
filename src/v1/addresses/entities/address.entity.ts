import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@/src/v1/users/entities';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'addressLine1 should not be empty' })
  addressLine1: string;

  @Column()
  @IsNotEmpty({ message: 'addressLine2 should not be empty' })
  addressLine2: string;

  @Column()
  @IsNotEmpty({ message: 'city should not be empty' })
  city: string;

  @Column()
  @IsNotEmpty({ message: 'state should not be empty' })
  state: string;

  @Column()
  @IsNotEmpty({ message: 'country should not be empty' })
  country: string;

  @Column()
  @IsInt({ message: 'Value must be an integer' })
  @Min(100000, { message: 'Value must have 6 digits' })
  @Max(999999, { message: 'Value must have 6 digits' })
  zipCode: number;

  @Exclude()
  @OneToOne((_type) => User, (user) => user.address, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
