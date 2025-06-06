import { AppConfig } from '@config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const supabaseUrl = this.configService.get('supabase.url', {
      infer: true,
    })!;
    const supabaseKey = this.configService.get('supabase.key', {
      infer: true,
    })!;

    this.bucket = this.configService.get('supabase.bucket', { infer: true })!;

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(path: string, file: Buffer, contentType: string) {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }
    return data;
  }

  getFileUrl(path: string) {
    return this.supabase.storage.from(this.bucket).getPublicUrl(path).data
      .publicUrl;
  }

  async deleteFile(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
    return { message: 'File deleted successfully' };
  }
}
