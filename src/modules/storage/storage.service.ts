import { BadRequestException, Injectable } from '@nestjs/common';

import { SupabaseService } from '@/shared';

@Injectable()
export class StorageService {
  private readonly STORAGE_PATH = 'images';

  constructor(private readonly supabaseService: SupabaseService) {}

  uploadFile(fileName: string, file: Buffer, contentType: string) {
    try {
      return this.supabaseService.uploadFile(
        `${this.STORAGE_PATH}/${fileName}`,
        file,
        contentType,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getFileUrl(fileName: string) {
    try {
      return this.supabaseService.getFileUrl(
        `${this.STORAGE_PATH}/${fileName}`,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  deleteFile(fileName: string) {
    try {
      return this.supabaseService.deleteFile(
        `${this.STORAGE_PATH}/${fileName}`,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
