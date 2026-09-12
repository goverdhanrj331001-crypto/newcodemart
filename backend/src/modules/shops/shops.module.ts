import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../../database/entities/shop.entity';
import { Product } from '../../database/entities/product.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Product, OrderItem, Order])],
  providers: [ShopsService],
  controllers: [ShopsController],
  exports: [ShopsService],
})
export class ShopsModule {}
