import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { UploadsService } from './uploads.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploads: UploadsService,
    private readonly config: ConfigService,
  ) {}

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a single image (jpg/png/gif/webp/svg)' })
  uploadImage(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.uploads.save(file, 'images');
  }

  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('file')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a downloadable source file (zip, pdf, etc.)' })
  uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.uploads.save(file, 'files');
  }

  @Public()
  @Get(':sub/:filename')
  serve(@Param('sub') sub: string, @Param('filename') filename: string, @Res() res: Response) {
    if (sub.includes('..') || filename.includes('..')) {
      throw new BadRequestException('Invalid path');
    }
    const root = this.config.get<string>('app.uploadDir', '/app/uploads');
    const fp = path.join(root, sub, filename);
    if (!fs.existsSync(fp)) {
      throw new BadRequestException('File not found');
    }
    return res.sendFile(fp);
  }

  @Public()
  @Get(':filename')
  serveRoot(@Param('filename') filename: string, @Res() res: Response) {
    if (filename.includes('..')) {
      throw new BadRequestException('Invalid path');
    }
    const root = this.config.get<string>('app.uploadDir', '/app/uploads');
    const fp = path.join(root, filename);
    if (!fs.existsSync(fp)) {
      throw new BadRequestException('File not found');
    }
    return res.sendFile(fp);
  }
}
