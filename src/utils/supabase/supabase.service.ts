import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from 'src/constants/env.constants';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly BUCKET = ENV.SUPABASE.BUCKET;

  constructor() {
    this.supabase = createClient(ENV.SUPABASE.URL, ENV.SUPABASE.KEY);
  }

  signUp(body: {
    email: string;
    password: string;
    displayName: string;
    avatarUrl?: string;
  }) {
    const { email, password, displayName, avatarUrl } = body;
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { displayName, avatarUrl },
        emailRedirectTo: ENV.CLIENT_URL,
      },
    });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  getUser(token: string) {
    return this.supabase.auth.getUser(token);
  }

  async uploadFile(path: string, file: Buffer, contentType: string) {
    const { data, error } = await this.supabase.storage
      .from(this.BUCKET)
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
    return this.supabase.storage.from(this.BUCKET).getPublicUrl(path).data
      .publicUrl;
  }

  async deleteFile(path: string) {
    const { error } = await this.supabase.storage
      .from(this.BUCKET)
      .remove([path]);
    if (error) {
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
    return { message: 'File deleted successfully' };
  }
}
