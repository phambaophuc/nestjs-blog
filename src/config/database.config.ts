import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENV } from 'src/constants/env.constants';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: ENV.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: ENV.NODE_ENV !== 'production',
  logging: ENV.NODE_ENV === 'development',
};
