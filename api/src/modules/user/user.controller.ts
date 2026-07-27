import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own user account details' })
  async updateAccount(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = await this.users.updateAccount(req.user?.['sub'] as string, dto);
    // Exclude passwordHash from response
    const { passwordHash, ...safeUser } = user;
    return { success: true, data: safeUser };
  }
}
