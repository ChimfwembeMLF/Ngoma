import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  async listUsers(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const [items, total] = await this.admin.listUsers(
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0,
    );
    return {
      success: true,
      data: items,
      pagination: {
        total,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      },
    };
  }

  @Post('users/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate user' })
  deactivate(@Param('id') id: string) {
    return this.admin.deactivateUser(id);
  }
}
