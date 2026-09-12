import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['tech', 'project_type'], default: 'tech' })
  @IsOptional()
  @IsEnum(['tech', 'project_type'])
  type?: string;

  @ApiProperty({ required: false, example: 'from-[#087ea4] via-[#0ea5e9] to-[#0284c7]' })
  @IsOptional()
  @IsString()
  gradient?: string;

  @ApiProperty({ required: false, example: '⚛' })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  monogram?: string;

  @ApiProperty({ required: false, example: 'React' })
  @IsOptional()
  @IsString()
  iconName?: string;

  @ApiProperty({ required: false, example: 'React' })
  @IsOptional()
  @IsString()
  filterCategory?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

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
  gradient?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8)
  monogram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iconName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filterCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
