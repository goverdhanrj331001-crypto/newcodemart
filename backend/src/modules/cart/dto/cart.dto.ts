import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
