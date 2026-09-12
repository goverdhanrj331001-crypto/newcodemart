import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProductStatus } from '../../../database/entities/product.entity';

export class ProductSpecificationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastUpdate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  published?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  layoutType?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  highResolution?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  compatibleBrowsers?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  filesIncluded?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullDescriptionHtml?: string;

  @ApiProperty()
  @IsUrl()
  image: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  gallery?: string[];

  @ApiProperty({ example: 39 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiProperty({ required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 'React' })
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  features: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  liveDemoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  sourceFileUrl?: string;

  @ApiProperty({ required: false, type: ProductSpecificationsDto })
  @IsOptional()
  @IsObject()
  specifications?: ProductSpecificationsDto;

  @ApiProperty({ required: false, enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shopId?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullDescriptionHtml?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  gallery?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  liveDemoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  specifications?: any;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
