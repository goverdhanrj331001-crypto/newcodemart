import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CourseCurriculumItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsInt()
  lessons: number;

  @ApiProperty()
  @IsString()
  duration: string;
}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty()
  @IsUrl()
  image: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  features: string[];

  @ApiProperty({ example: 49 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiProperty({ required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  lessons?: number;

  @ApiProperty({ enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' })
  @IsOptional()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
  level?: string;

  @ApiProperty({ required: false, enum: ['Bestseller', 'Hot', 'Updated', 'New'] })
  @IsOptional()
  @IsEnum(['Bestseller', 'Hot', 'Updated', 'New'])
  badge?: string;

  @ApiProperty({ required: false, type: [CourseCurriculumItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseCurriculumItemDto)
  curriculum?: CourseCurriculumItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  previewVideoUrl?: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  features?: string[];

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
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  lessons?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['Bestseller', 'Hot', 'Updated', 'New'])
  badge?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  curriculum?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  previewVideoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
