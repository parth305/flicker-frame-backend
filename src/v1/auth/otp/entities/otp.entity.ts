import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  userEmail: string;

  @Column()
  otpValue: number;

  @Column()
  expiresAt: Date;

  @Column()
  otpAttempts: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
