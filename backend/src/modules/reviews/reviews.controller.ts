import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, AdminUpdateReviewDto } from './dto/review.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Public()
  @Get('product/:productId')
  listByProduct(@Param('productId') productId: string, @Query() pagination: PaginationDto) {
    return this.reviews.listByProduct(productId, pagination);
  }

  @Post('product/:productId')
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviews.create(productId, dto, {
      id: user.id,
      name: (user as any).name ?? '',
      avatar: (user as any).avatar ?? null,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto, @CurrentUser() user: AuthUser) {
    return this.reviews.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.reviews.delete(id, user.id);
  }

  @Public()
  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.reviews.like(id);
  }

  // ---- Admin ----

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  adminList(
    @Query() pagination: PaginationDto,
    @Query('status') status?: any,
  ) {
    return this.reviews.listAll({ ...pagination, status });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id')
  adminUpdate(@Param('id') id: string, @Body() dto: AdminUpdateReviewDto) {
    return this.reviews.adminUpdate(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete('admin/:id')
  adminDelete(@Param('id') id: string) {
    return this.reviews.adminDelete(id);
  }
}
