import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Board } from '../board/entities/board.entity';
import { Post } from '../post/entities/post.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_DATABASE', 'nest_practice'),
    entities: [Board, Post],
    synchronize:
      configService.get<string>('TYPEORM_SYNCHRONIZE', 'false') === 'true',
    logging: configService.get<string>('TYPEORM_LOGGING', 'false') === 'true',
  }),
  inject: [ConfigService],
};
