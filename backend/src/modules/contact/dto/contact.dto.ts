import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;
}

export class UpdateContactStatusDto {
  @ApiProperty({ enum: ['pending', 'read', 'resolved', 'archived'] })
  @IsString()
  status: string;
}
