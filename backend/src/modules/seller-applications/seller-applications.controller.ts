import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SellerApplicationsService } from './seller-applications.service';
import { CreateSellerApplicationDto, ReviewSellerApplicationDto } from './dto/seller-application.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SellerApplicationStatus } from '../../database/entities/seller-application.entity';

@ApiTags('seller-applications')
@Controller('seller-applications')
export class SellerApplicationsController {
  constructor(private readonly apps: SellerApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a seller application' })
  create(@Body() dto: CreateSellerApplicationDto, @CurrentUser() user: AuthUser) {
    return this.apps.create(dto, user.id);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get my applications' })
  mine(@CurrentUser() user: AuthUser) {
    return this.apps.mine(user.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Admin: list all applications' })
  adminList(
    @Query() pagination: PaginationDto,
    @Query('status') status?: SellerApplicationStatus,
  ) {
    return this.apps.adminList(pagination, status);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/review')
  @ApiOperation({ summary: 'Admin: approve / reject an application' })
  adminReview(
    @Param('id') id: string,
    @Body() dto: ReviewSellerApplicationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.apps.adminReview(id, dto, user.id);
  }
}
