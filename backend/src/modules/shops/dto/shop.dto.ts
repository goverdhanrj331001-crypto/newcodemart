import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ShopStatus } from '../../../database/entities/shop.entity';

export class CreateShopDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  banner?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ enum: ShopStatus })
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @ApiPropertyOptional({ default: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  commissionRate?: number;
}

export class UpdateShopDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  banner?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ enum: ShopStatus })
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  commissionRate?: number;
}
