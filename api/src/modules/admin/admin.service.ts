import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  listUsers(limit = 50, offset = 0, role?: UserRole) {
    return this.usersRepo.findAndCount({
      where: role ? { role } : {},
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
      skip: offset,
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'isActive',
        'createdAt',
        'lastLogin',
      ],
    });
  }

  async deactivateUser(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false;
    await this.usersRepo.save(user);
    return { success: true, data: { id, isActive: false } };
  }
}
