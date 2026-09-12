import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerApplication } from '../../database/entities/seller-application.entity';
import { User } from '../../database/entities/user.entity';
import { SellerApplicationsService } from './seller-applications.service';
import { SellerApplicationsController } from './seller-applications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SellerApplication, User])],
  providers: [SellerApplicationsService],
  controllers: [SellerApplicationsController],
  exports: [SellerApplicationsService],
})
export class SellerApplicationsModule {}
