import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // ---------- Public ----------

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published products (paginated, filterable)' })
  list(
    @Query() pagination: PaginationDto,
    @Query('category') category?: string,
    @Query('isFree') isFree?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.products.listPublic({
      ...pagination,
      category,
      isFree: isFree === 'true' ? true : isFree === 'false' ? false : undefined,
      authorId,
    });
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Featured products (top selling)' })
  featured(@Query('limit') limit?: string) {
    return this.products.featured(limit ? parseInt(limit, 10) : 8);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug with reviews + related' })
  getBySlug(@Param('slug') slug: string) {
    return this.products.getBySlug(slug);
  }

  // ---------- Auth (seller/admin) ----------

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('mine')
  @ApiOperation({ summary: 'List my products (seller) or all (admin)' })
  mine(@CurrentUser() user: AuthUser, @Query() pagination: PaginationDto) {
    return this.products.listForUser(user.id, user.role as UserRole, pagination);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() dto: CreateProductDto, @CurrentUser() user: AuthUser) {
    return this.products.create(dto, user.id);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.products.update(id, dto, user.id, user.role as UserRole);
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a product' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.products.remove(id, user.id, user.role as UserRole);
  }
}
