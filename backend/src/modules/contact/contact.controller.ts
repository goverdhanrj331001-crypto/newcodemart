import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactStatusDto } from './dto/contact.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a contact form message' })
  create(@Body() dto: CreateContactDto, @Req() req: Request, @CurrentUser() user?: AuthUser) {
    return this.contact.create(dto, {
      userId: user?.id,
      ipAddress: req.ip ?? undefined,
      userAgent: req.headers?.['user-agent'] ?? undefined,
    });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Admin: list contact messages' })
  adminList(@Query() pagination: PaginationDto, @Query('status') status?: string) {
    return this.contact.adminList({ ...pagination, status });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id')
  @ApiOperation({ summary: 'Admin: update contact message status' })
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateContactStatusDto) {
    return this.contact.adminUpdateStatus(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Admin: delete contact message' })
  adminDelete(@Param('id') id: string) {
    return this.contact.adminDelete(id);
  }
}
