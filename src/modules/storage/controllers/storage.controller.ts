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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { StorageService } from '../services/storage.service';

@ApiTags('StorageController')
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
  public async uploadFile(
    @Res() response: Response,
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

    return response.status(HttpStatus.OK).json({
      url: this.storageService.getFileUrl(fileName),
    });
  }

  @Get(':filename')
  public getFileUrl(
    @Res() response: Response,
    @Param('filename') filename: string,
  ) {
    return response
      .status(HttpStatus.OK)
      .json({ url: this.storageService.getFileUrl(filename) });
  }

  @Delete(':filename')
  public deleteFile(
    @Res() response: Response,
    @Param('filename') filename: string,
  ) {
    return response
      .status(HttpStatus.OK)
      .json(this.storageService.deleteFile(filename));
  }
}
