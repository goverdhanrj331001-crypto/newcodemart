import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { PaymentMethod } from '../../../database/entities/order.entity';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity?: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ required: false, description: 'Discount coupon code if any.' })
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'] })
  @IsEnum(['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'])
  status: any;
}
