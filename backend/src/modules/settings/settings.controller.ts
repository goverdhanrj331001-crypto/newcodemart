import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get site-wide settings (public read)' })
  get() {
    return this.settings.getCached();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch()
  @ApiOperation({ summary: 'Admin: update site-wide settings' })
  update(@Body() dto: UpdateSettingsDto) {
    return this.settings.update(dto);
  }
}
