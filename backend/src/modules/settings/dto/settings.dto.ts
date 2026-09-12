import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  siteTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  siteDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencySymbol?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8)
  currencyCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supportEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableVendorRegistration?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableGuestCheckout?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  popupBannerEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableEmailVerification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  socialLinks?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  footerHtml?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extraJson?: string;
}
