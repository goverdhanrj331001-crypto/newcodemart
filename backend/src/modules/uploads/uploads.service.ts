import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger('Uploads');
  private readonly uploadDir: string;
  private readonly maxBytes: number;
  private readonly allowedMime = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
    'video/mp4',
  ];

  constructor(private readonly config: ConfigService) {
    this.uploadDir = this.config.get<string>('app.uploadDir', '/app/uploads');
    this.maxBytes = this.config.get<number>('app.maxUploadSizeMb', 25) * 1024 * 1024;
  }

  async save(file: UploadedFile, subDir = ''): Promise<UploadResult> {
    if (!file) throw new Error('No file provided');
    if (file.size > this.maxBytes) {
      throw new Error(`File exceeds max allowed size of ${this.config.get<number>('app.maxUploadSizeMb')}MB`);
    }
    if (!this.allowedMime.includes(file.mimetype)) {
      throw new Error(`MIME type ${file.mimetype} not allowed`);
    }

    const dir = path.join(this.uploadDir, subDir);
    if (!existsSync(dir)) await fs.mkdir(dir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase() || this.extFromMime(file.mimetype);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 14)}${ext}`;
    const filepath = path.join(dir, filename);

    await fs.writeFile(filepath, file.buffer);

    const publicPath = subDir ? `/${subDir}/${filename}` : `/${filename}`;
    const baseUrl = this.config.get<string>('app.url', 'http://localhost:4000');
    return {
      url: `${baseUrl}/uploads${publicPath}`,
      filename: publicPath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(filepath: string): Promise<{ message: string }> {
    try {
      const full = path.join(this.uploadDir, filepath.replace(/^\//, ''));
      await fs.unlink(full);
      return { message: 'File deleted' };
    } catch (e: any) {
      this.logger.warn(`Failed to delete file: ${e.message}`);
      return { message: 'File could not be deleted' };
    }
  }

  private extFromMime(mime: string): string {
    switch (mime) {
      case 'image/jpeg': return '.jpg';
      case 'image/png': return '.png';
      case 'image/gif': return '.gif';
      case 'image/webp': return '.webp';
      case 'image/svg+xml': return '.svg';
      case 'application/pdf': return '.pdf';
      case 'application/zip': return '.zip';
      default: return '';
    }
  }
}
