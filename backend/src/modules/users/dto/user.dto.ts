import { PartialType, OmitType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../../database/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiProperty({ required: false, enum: UserRole })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ required: false, enum: UserStatus })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  walletPoints?: number;
}
