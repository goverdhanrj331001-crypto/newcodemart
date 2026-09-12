import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { SellerApplicationStatus } from '../../../database/entities/seller-application.entity';

export class CreateSellerApplicationDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  studioName: string;

  @ApiProperty()
  @IsUrl()
  portfolioUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ description: 'URL to sample work (zip, github repo, etc.)' })
  @IsOptional()
  @IsUrl()
  sampleWork?: string;
}

export class ReviewSellerApplicationDto {
  @ApiProperty({ enum: SellerApplicationStatus })
  @IsEnum(SellerApplicationStatus)
  status: SellerApplicationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
