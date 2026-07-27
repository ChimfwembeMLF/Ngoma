import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findByPhone(phone: string) {
    return this.usersRepo.findOne({ where: { phone } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  create(data: Partial<User>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async updateLastLogin(id: string) {
    await this.usersRepo.update(id, { lastLogin: new Date() });
  }

  async updateAccount(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      user.email = dto.email;
    }

    if (dto.fullName) {
      user.fullName = dto.fullName;
    }

    if (dto.avatarUrl) {
      user.avatarUrl = dto.avatarUrl;
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.usersRepo.save(user);
  }
}
