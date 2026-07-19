import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';

export enum UserRole {
  LISTENER = 'LISTENER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ unique: true })
  phone: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 20, default: UserRole.LISTENER })
  role: UserRole;

  @Column({ nullable: true })
  country?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'last_login', type: 'timestamptz', nullable: true })
  lastLogin?: Date;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist?: Artist;
}
