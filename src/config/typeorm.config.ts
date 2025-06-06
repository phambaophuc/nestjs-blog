import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Entities from 'entities';
import { DataSourceOptions } from 'typeorm';

export const getTypeOrmConfig = (
  configService: ConfigService,
): DataSourceOptions | TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('database.url'),
  ssl: { rejectUnauthorized: false },
  entities: Object.values(Entities),
  synchronize: configService.get('database.synchronize'),
  logging: false,
});
