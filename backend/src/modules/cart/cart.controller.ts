import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  get(@CurrentUser() user: AuthUser) {
    return this.cart.get(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product to cart' })
  add(@CurrentUser() user: AuthUser, @Body() dto: AddToCartDto) {
    return this.cart.add(user.id, dto);
  }

  @Patch('items')
  @ApiOperation({ summary: 'Update cart item quantity' })
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateCartDto) {
    return this.cart.update(user.id, dto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  remove(@CurrentUser() user: AuthUser, @Param('productId') productId: string) {
    return this.cart.remove(user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  clear(@CurrentUser() user: AuthUser) {
    return this.cart.clear(user.id);
  }
}
