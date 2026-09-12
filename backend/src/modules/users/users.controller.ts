import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, UserStatus } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserDto) {
    return this.users.update(user.id, dto);
  }

  // ---- Admin endpoints ----

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Admin: list users (paginated, filterable)' })
  adminList(
    @Query() pagination: PaginationDto,
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
  ) {
    return this.users.adminList({
      page: pagination.page,
      limit: pagination.limit,
      search: pagination.search,
      role,
      status,
    });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/:id')
  @ApiOperation({ summary: 'Admin: get single user' })
  adminGet(@Param('id') id: string) {
    return this.users.adminFindOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id')
  @ApiOperation({ summary: 'Admin: update user' })
  adminUpdate(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.users.adminUpdate(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/ban')
  @ApiOperation({ summary: 'Super-admin: ban / unban user' })
  adminBan(@Param('id') id: string, @Body('banned') banned: boolean) {
    return this.users.ban(id, !!banned);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Super-admin: delete user' })
  adminDelete(@Param('id') id: string) {
    return this.users.adminDelete(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/wallet')
  @ApiOperation({ summary: 'Admin: adjust wallet points (+/-)' })
  adminWallet(@Param('id') id: string, @Body('delta') delta: number) {
    return this.users.adjustWallet(id, Number(delta) || 0);
  }
}
