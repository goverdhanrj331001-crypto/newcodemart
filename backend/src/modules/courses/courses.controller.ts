import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Public()
  @Get()
  list(
    @Query() pagination: PaginationDto,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('isFree') isFree?: string,
  ) {
    return this.courses.listPublic({
      ...pagination,
      category,
      level,
      isFree: isFree === 'true' ? true : undefined,
    });
  }

  @Public()
  @Get('featured')
  featured(@Query('limit') limit?: string) {
    return this.courses.featured(limit ? parseInt(limit, 10) : 8);
  }

  @Public()
  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.courses.getBySlug(slug);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('mine')
  mine(@CurrentUser() user: AuthUser, @Query() pagination: PaginationDto) {
    return this.courses.listForUser(user.id, user.role as UserRole, pagination);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: AuthUser) {
    return this.courses.create(dto, user.id);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentUser() user: AuthUser) {
    return this.courses.update(id, dto, user.id, user.role as UserRole);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.courses.remove(id, user.id, user.role as UserRole);
  }
}
