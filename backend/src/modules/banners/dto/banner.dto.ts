import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ enum: ['explore_carousel', 'courses_top', 'popup_promo'] })
  @IsEnum(['explore_carousel', 'courses_top', 'popup_promo'])
  type: string;

  @ApiProperty()
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  targetUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badgeText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discountTag?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class UpdateBannerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ enum: ['explore_carousel', 'courses_top', 'popup_promo'] })
  @IsOptional()
  @IsEnum(['explore_carousel', 'courses_top', 'popup_promo'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  targetUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badgeText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discountTag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}
