import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Product } from '../../database/entities/product.entity';
import { Order } from '../../database/entities/order.entity';
import { Review } from '../../database/entities/review.entity';
import { Shop } from '../../database/entities/shop.entity';
import { Course } from '../../database/entities/course.entity';
import { Banner } from '../../database/entities/banner.entity';
import { ContactMessage } from '../../database/entities/contact-message.entity';
import { SellerApplication } from '../../database/entities/seller-application.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Order,
      Review,
      Shop,
      Course,
      Banner,
      ContactMessage,
      SellerApplication,
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
