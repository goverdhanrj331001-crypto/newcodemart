import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  question: string;
}

export class UpdateQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  question?: string;
}

export class AnswerQuestionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  answer: string;

  @ApiProperty({ required: false, description: 'Name of the responder (defaults to author name).' })
  @IsOptional()
  @IsString()
  answeredBy?: string;
}
