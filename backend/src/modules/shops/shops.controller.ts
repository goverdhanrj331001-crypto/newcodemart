import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ShopStatus } from '../../database/entities/shop.entity';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shops: ShopsService) {}

  @Public()
  @Get()
  list(@Query() pagination: PaginationDto) {
    return this.shops.listPublic(pagination);
  }

  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.shops.mine(user.id);
  }

  @Public()
  @Get(':id')
  get(@Param('id') id: string) {
    return this.shops.findOne(id);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateShopDto, @CurrentUser() user: AuthUser) {
    return this.shops.create(dto, user.id, user.role as UserRole);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShopDto, @CurrentUser() user: AuthUser) {
    return this.shops.update(id, dto, user.id, user.role as UserRole);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/status')
  setStatus(@Param('id') id: string, @Body('status') status: ShopStatus) {
    return this.shops.setStatus(id, status);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('admin/recompute')
  recompute() {
    return this.shops.recompute();
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.shops.remove(id, user.id, user.role as UserRole);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/list')
  adminList(@Query() pagination: PaginationDto, @Query('status') status?: ShopStatus) {
    return this.shops.adminList({ ...pagination, status });
  }
}
