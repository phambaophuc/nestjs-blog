import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENV } from 'src/constants/env.constants';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: ENV.DATABASE.HOST,
  port: ENV.DATABASE.PORT,
  username: ENV.DATABASE.USERNAME,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: ENV.NODE_ENV !== 'production',
  logging: ENV.NODE_ENV === 'development',
};
