import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Public()
  @UseGuards(OptionalJwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order (guest checkout allowed)' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user?: AuthUser) {
    return this.orders.create(
      dto,
      user ? { id: user.id, name: (user as any).name ?? '', email: (user as any).email ?? '' } : undefined,
    );
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get current user orders' })
  mine(@CurrentUser() user: AuthUser, @Query() pagination: PaginationDto) {
    return this.orders.listForUser(user.id, pagination);
  }

  @Public()
  @Get('by-number/:orderNumber')
  @ApiOperation({ summary: 'Public lookup of order by order number (for guest checkouts)' })
  byNumber(@Param('orderNumber') orderNumber: string) {
    return this.orders.findByNumber(orderNumber);
  }

  // ---- Admin ----

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Admin: list all orders' })
  adminList(@Query() pagination: PaginationDto, @Query('status') status?: any) {
    return this.orders.adminList({ ...pagination, status });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/:id')
  @ApiOperation({ summary: 'Admin: get single order' })
  adminGet(@Param('id') id: string) {
    return this.orders.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/status')
  @ApiOperation({ summary: 'Admin: update order status' })
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto, @CurrentUser() user: AuthUser) {
    return this.orders.adminUpdateStatus(id, dto, user.id);
  }
}
