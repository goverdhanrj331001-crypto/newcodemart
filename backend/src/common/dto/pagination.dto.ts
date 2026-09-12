import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Field to sort by (e.g. createdAt, price, title)' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortDir?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'Free-text search' })
  @IsOptional()
  @IsString()
  search?: string;
}

/** Compute the SQL OFFSET value from page + limit. */
export function skipOf(p: { page: number; limit: number }): number {
  return Math.max(0, (p.page - 1) * p.limit);
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginate<T>(items: T[], total: number, dto: PaginationDto): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / dto.limit));
  return {
    data: items,
    meta: {
      page: dto.page,
      limit: dto.limit,
      total,
      totalPages,
      hasNext: dto.page < totalPages,
      hasPrev: dto.page > 1,
    },
  };
}
