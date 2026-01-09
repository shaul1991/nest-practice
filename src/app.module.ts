import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';
import { Board } from './board/entities/board.entity';
import { Post } from './post/entities/post.entity';

/**
 * Module: AppModule (애플리케이션 루트 모듈)
 *
 * 애플리케이션의 최상위 모듈입니다.
 * - 모든 기능 모듈을 통합합니다
 * - 전역 설정을 관리합니다 (데이터베이스, 환경 변수 등)
 */
@Module({
  imports: [
    /**
     * ConfigModule: 환경 변수 관리
     * - .env 파일에서 환경 변수를 로드합니다
     * - isGlobal: true로 설정하면 모든 모듈에서 사용 가능합니다
     */
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
      envFilePath: '.env', // .env 파일 경로
    }),

    /**
     * TypeOrmModule: TypeORM 데이터베이스 연동
     * - PostgreSQL 데이터베이스와 연결합니다
     * - Entity를 등록하여 테이블을 자동 생성합니다
     *
     * forRootAsync를 사용하는 이유:
     * - ConfigService를 사용하여 환경 변수를 읽기 위해 비동기 설정이 필요합니다
     * - 데이터베이스 연결 정보를 .env 파일에서 가져옵니다
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // 데이터베이스 타입
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'nest_practice'),
        entities: [Board, Post], // 엔티티 등록
        synchronize:
          configService.get<string>('TYPEORM_SYNCHRONIZE', 'false') === 'true',
        logging:
          configService.get<string>('TYPEORM_LOGGING', 'false') === 'true',
      }),
      inject: [ConfigService],
    }),

    // 기능 모듈들
    BoardModule,
    PostModule,
  ],
})
export class AppModule { }
