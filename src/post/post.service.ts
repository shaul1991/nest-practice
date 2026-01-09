import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { BoardService } from '../board/board.service';

/**
 * Service: PostService (게시글 비즈니스 로직 서비스)
 *
 * PostService는 게시글 관련 비즈니스 로직을 처리합니다.
 * - BoardService에 의존합니다 (게시판 존재 여부 확인)
 * - 게시글의 생성, 조회, 수정, 삭제를 담당합니다
 *
 * 의존성 주입 (Dependency Injection):
 * - BoardService를 생성자에서 주입받습니다
 * - PostModule에서 BoardModule을 import해야 합니다
 * - BoardModule에서 BoardService를 export해야 합니다
 */
@Injectable()
export class PostService {
  /**
   * 게시글 데이터 저장소 (메모리 기반)
   */
  private posts: Post[] = [];

  /**
   * 다음 게시글 ID (자동 증가)
   */
  private nextId = 1;

  /**
   * 의존성 주입: BoardService
   *
   * @param boardService - BoardService 인스턴스 (NestJS가 자동 주입)
   *
   * 왜 BoardService가 필요한가?
   * - 게시글 생성 시 boardId의 유효성을 검증해야 합니다
   * - 존재하지 않는 게시판에 게시글을 생성하는 것을 방지합니다
   * - 참조 무결성(Referential Integrity)을 보장합니다
   */
  constructor(private readonly boardService: BoardService) {}

  /**
   * 게시글 생성
   *
   * @param createPostDto - 생성할 게시글 정보
   * @returns 생성된 게시글 엔티티
   * @throws BadRequestException - boardId가 유효하지 않은 경우
   *
   * 비즈니스 로직:
   * 1. boardId 유효성 검사 (게시판이 존재하는지 확인)
   * 2. 게시글 엔티티 생성
   * 3. 메모리 저장소에 추가
   */
  create(createPostDto: CreatePostDto): Post {
    // boardId 유효성 검사: 게시판이 존재하는지 확인
    try {
      this.boardService.findOne(createPostDto.boardId);
    } catch (error) {
      // 게시판이 없으면 BadRequestException 발생
      // 400 Bad Request: 클라이언트가 잘못된 요청을 보낸 경우
      throw new BadRequestException(
        `Board with ID ${createPostDto.boardId} not found`,
      );
    }

    const now = new Date();
    const post = new Post(
      this.nextId++,
      createPostDto.boardId,
      createPostDto.title,
      createPostDto.content,
      now,
      now,
      null,
    );
    this.posts.push(post);
    return post;
  }

  /**
   * 게시글 목록 조회
   *
   * @param boardId - 선택적 필터: 특정 게시판의 게시글만 조회
   * @returns 삭제되지 않은 게시글 배열
   *
   * 필터링 옵션:
   * - boardId가 제공되면: 해당 게시판의 게시글만 반환
   * - boardId가 없으면: 모든 게시글 반환
   * - 삭제된 게시글은 항상 제외됩니다
   */
  findAll(boardId?: number): Post[] {
    if (boardId !== undefined) {
      // 특정 게시판의 게시글만 필터링
      return this.posts.filter(
        (post) => post.boardId === boardId && post.deletedAt === null,
      );
    }
    // 모든 게시글 반환 (삭제되지 않은 것만)
    return this.posts.filter((post) => post.deletedAt === null);
  }

  /**
   * ID로 게시글 조회
   *
   * @param id - 조회할 게시글 ID
   * @returns 조회된 게시글 엔티티
   * @throws NotFoundException - 게시글이 없거나 삭제된 경우
   */
  findOne(id: number): Post {
    const post = this.posts.find((p) => p.id === id && p.deletedAt === null);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * 게시글 수정
   *
   * @param id - 수정할 게시글 ID
   * @param updatePostDto - 수정할 정보 (제목, 내용 - 선택적)
   * @returns 수정된 게시글 엔티티
   *
   * 부분 업데이트:
   * - 제공된 필드만 업데이트합니다
   * - updatedAt은 항상 현재 시각으로 갱신됩니다
   */
  update(id: number, updatePostDto: UpdatePostDto): Post {
    const post = this.findOne(id);
    const now = new Date();

    if (updatePostDto.title !== undefined && updatePostDto.title !== null) {
      post.title = updatePostDto.title;
    }
    if (updatePostDto.content !== undefined && updatePostDto.content !== null) {
      post.content = updatePostDto.content;
    }
    post.updatedAt = now;

    return post;
  }

  /**
   * 게시글 삭제 (Soft Delete)
   *
   * @param id - 삭제할 게시글 ID
   */
  remove(id: number): void {
    const post = this.findOne(id);
    post.deletedAt = new Date();
  }
}
