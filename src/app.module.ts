import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';
import { typeOrmConfig } from './config/typeorm.config';
import { redisConfig } from './config/redis.config';

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
     * - 설정은 config/typeorm.config.ts에서 관리됩니다
     */
    TypeOrmModule.forRootAsync(typeOrmConfig),

    /**
     * CacheModule: Redis 캐시 연동
     * - Redis를 캐시 저장소로 사용합니다
     * - 설정은 config/redis.config.ts에서 관리됩니다
     */
    CacheModule.registerAsync(redisConfig),

    // 기능 모듈들
    BoardModule,
    PostModule,
  ],
})
export class AppModule { }
