import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { QuestionsService } from './questions.service';
import { CreateQuestionDto, AnswerQuestionDto } from './dto/question.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '../../common/decorators/role.enum';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}

  @Public()
  @Get('product/:productId')
  listByProduct(@Param('productId') productId: string, @Query() pagination: PaginationDto) {
    return this.questions.listByProduct(productId, pagination);
  }

  @Post('product/:productId')
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateQuestionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.questions.create(productId, dto, {
      id: user.id,
      name: (user as any).name ?? '',
      avatar: (user as any).avatar ?? null,
    });
  }

  @Patch(':id/answer')
  answer(@Param('id') id: string, @Body() dto: AnswerQuestionDto, @CurrentUser() user: AuthUser) {
    return this.questions.answer(id, dto, {
      id: user.id,
      name: (user as any).name ?? '',
      role: user.role as UserRole,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.questions.remove(id, user.id, user.role as UserRole);
  }
}
