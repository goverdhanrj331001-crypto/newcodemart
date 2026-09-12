import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Admin: dashboard stats (counts, revenue, etc.)' })
  stats() {
    return this.admin.getDashboardStats();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('revenue')
  @ApiOperation({ summary: 'Admin: revenue chart (last N days, default 30)' })
  revenue(@Query('days') days?: string) {
    return this.admin.revenueByPeriod(days ? parseInt(days, 10) : 30);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('top-products')
  @ApiOperation({ summary: 'Admin: top selling products' })
  topProducts(@Query('limit') limit?: string) {
    return this.admin.topProducts(limit ? parseInt(limit, 10) : 10);
  }
}
