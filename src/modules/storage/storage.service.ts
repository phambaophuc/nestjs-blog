import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/utils/supabase/supabase.service';

@Injectable()
export class StorageService {
  private readonly STORAGE_PATH = 'images';

  constructor(private readonly supabaseService: SupabaseService) {}

  uploadFile(fileName: string, file: Buffer, contentType: string) {
    return this.supabaseService.uploadFile(
      `${this.STORAGE_PATH}/${fileName}`,
      file,
      contentType,
    );
  }

  getFileUrl(fileName: string) {
    return this.supabaseService.getFileUrl(`${this.STORAGE_PATH}/${fileName}`);
  }

  deleteFile(fileName: string) {
    return this.supabaseService.deleteFile(`${this.STORAGE_PATH}/${fileName}`);
  }
}
