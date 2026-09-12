import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly cats: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active categories' })
  list() {
    return this.cats.listPublic();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Admin: list all categories (incl. inactive)' })
  adminList() {
    return this.cats.adminList();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('admin/recount')
  @ApiOperation({ summary: 'Admin: recompute product counts' })
  recount() {
    return this.cats.recomputeCounts();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/:id')
  adminGet(@Param('id') id: string) {
    return this.cats.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Admin: create category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.cats.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update category' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.cats.update(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Admin: delete category' })
  remove(@Param('id') id: string) {
    return this.cats.remove(id);
  }
}
