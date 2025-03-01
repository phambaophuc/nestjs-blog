import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
  Get,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { Express } from 'express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File upload failed');
    }

    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${safeFileName}`;

    await this.storageService.uploadFile(fileName, file.buffer, file.mimetype);

    return { url: this.storageService.getFileUrl(fileName) };
  }

  @Get(':filename')
  getFileUrl(@Param('filename') filename: string) {
    return { url: this.storageService.getFileUrl(filename) };
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    return this.storageService.deleteFile(filename);
  }
}
