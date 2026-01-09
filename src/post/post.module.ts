import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { BoardModule } from '../board/board.module';

/**
 * Module: PostModule (게시글 모듈)
 *
 * 게시글 관련 기능을 그룹화하는 모듈입니다.
 * - PostController와 PostService를 포함합니다
 * - BoardModule에 의존합니다 (PostService가 BoardService를 사용)
 * - TypeORM을 사용하여 데이터베이스와 연동합니다
 *
 * 모듈 간 의존성:
 * - PostModule은 BoardModule을 import합니다
 * - BoardModule에서 BoardService를 export해야 합니다
 * - PostService가 BoardService를 주입받을 수 있게 됩니다
 */
@Module({
  /**
   * imports: 이 모듈이 의존하는 다른 모듈 목록
   *
   * TypeOrmModule.forFeature([Post]):
   * - Post 엔티티에 대한 Repository를 이 모듈에서 사용할 수 있게 합니다
   * - PostService에서 @InjectRepository(Post)로 주입받을 수 있습니다
   *
   * BoardModule:
   * - PostService가 BoardService를 사용해야 합니다
   * - BoardModule에서 BoardService를 export했으므로 사용 가능합니다
   *
   * 모듈 의존성 체인:
   * PostModule → BoardModule, TypeOrmModule
   *   - PostService → BoardService, PostRepository (의존성 주입)
   */
  imports: [TypeOrmModule.forFeature([Post]), BoardModule],

  /**
   * controllers: 이 모듈에 속한 Controller 목록
   */
  controllers: [PostController],

  /**
   * providers: 이 모듈에 속한 Provider 목록
   *
   * PostService는 다른 모듈에서 사용하지 않으므로 export하지 않습니다.
   * - BoardService와 달리 PostService는 외부에서 직접 사용되지 않습니다
   * - 필요하다면 나중에 export할 수 있습니다
   */
  providers: [PostService],
})
export class PostModule {}
