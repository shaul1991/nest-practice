import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { BoardService } from '../board/board.service';

/**
 * Service: PostService (게시글 비즈니스 로직 서비스)
 *
 * PostService는 게시글 관련 비즈니스 로직을 처리합니다.
 * - BoardService에 의존합니다 (게시판 존재 여부 확인)
 * - TypeORM Repository를 사용하여 데이터베이스 작업을 수행합니다
 * - 게시글의 생성, 조회, 수정, 삭제를 담당합니다
 *
 * Repository 패턴:
 * - TypeORM의 Repository를 사용하여 데이터베이스 작업을 수행합니다
 * - 데이터 접근 로직을 캡슐화합니다
 * - 테스트 시 Mock Repository를 쉽게 주입할 수 있습니다
 *
 * 의존성 주입 (Dependency Injection):
 * - BoardService와 Post Repository를 생성자에서 주입받습니다
 * - PostModule에서 BoardModule과 TypeOrmModule을 import해야 합니다
 */
@Injectable()
export class PostService {
  /**
   * TypeORM Repository
   * - @InjectRepository(): TypeORM Repository를 주입받습니다
   * - Repository<Post>: Post 엔티티에 대한 Repository 타입
   * - 데이터베이스 CRUD 작업을 수행합니다
   */
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly boardService: BoardService,
  ) { }

  /**
   * 게시글 생성
   *
   * @param createPostDto - 생성할 게시글 정보
   * @returns 생성된 게시글 엔티티
   * @throws BadRequestException - board_id가 유효하지 않은 경우
   *
   * 비즈니스 로직:
   * 1. board_id 유효성 검사 (게시판이 존재하는지 확인)
   * 2. 게시글 엔티티 생성
   * 3. 데이터베이스에 저장
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    // board_id 유효성 검사: 게시판이 존재하는지 확인
    try {
      await this.boardService.findOne(createPostDto.boardId);
    } catch {
      // 게시판이 없으면 BadRequestException 발생
      // 400 Bad Request: 클라이언트가 잘못된 요청을 보낸 경우
      throw new BadRequestException(
        `Board with ID ${createPostDto.boardId} not found`,
      );
    }

    // 새로운 게시글 엔티티 생성
    const post = this.postRepository.create({
      board_id: createPostDto.boardId,
      title: createPostDto.title,
      content: createPostDto.content,
    });

    // 데이터베이스에 저장
    return await this.postRepository.save(post);
  }

  /**
   * 게시글 목록 조회
   *
   * @param board_id - 선택적 필터: 특정 게시판의 게시글만 조회
   * @returns 삭제되지 않은 게시글 배열
   *
   * TypeORM의 find() 메서드:
   * - where 조건으로 필터링할 수 있습니다
   * - @DeleteDateColumn()이 있으면 자동으로 deletedAt이 null인 레코드만 조회합니다
   *
   * 필터링 옵션:
   * - board_id가 제공되면: 해당 게시판의 게시글만 반환
   * - board_id가 없으면: 모든 게시글 반환
   * - 삭제된 게시글은 항상 제외됩니다
   */
  async findAll(board_id?: number): Promise<Post[]> {
    if (board_id !== undefined) {
      // 특정 게시판의 게시글만 필터링
      return await this.postRepository.find({
        where: { board_id },
      });
    }
    // 모든 게시글 반환 (삭제되지 않은 것만)
    return await this.postRepository.find();
  }

  /**
   * ID로 게시글 조회
   *
   * @param id - 조회할 게시글 ID
   * @returns 조회된 게시글 엔티티
   * @throws NotFoundException - 게시글이 없거나 삭제된 경우
   *
   * TypeORM의 findOne() 메서드:
   * - where 조건으로 ID를 지정합니다
   * - @DeleteDateColumn()이 있으면 자동으로 deletedAt이 null인 레코드만 조회합니다
   */
  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
    });

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
   * - @UpdateDateColumn()이 자동으로 updatedAt을 갱신합니다
   *
   * TypeORM의 save() 메서드:
   * - 엔티티에 id가 있으면 업데이트, 없으면 생성합니다
   * - 부분 업데이트를 위해 Object.assign()을 사용합니다
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    // 부분 업데이트: 제공된 필드만 업데이트
    Object.assign(post, updatePostDto);

    // 데이터베이스에 저장 (업데이트)
    // @UpdateDateColumn()이 자동으로 updatedAt을 갱신합니다
    return await this.postRepository.save(post);
  }

  /**
   * 게시글 삭제 (Soft Delete)
   *
   * @param id - 삭제할 게시글 ID
   *
   * TypeORM의 softRemove() 메서드:
   * - @DeleteDateColumn()이 있는 엔티티의 Soft Delete를 수행합니다
   * - deletedAt에 현재 시각을 자동으로 설정합니다
   * - 실제로 데이터베이스에서 삭제되지 않고 표시만 됩니다
   */
  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);

    // Soft Delete: deletedAt에 현재 시각 설정
    await this.postRepository.softRemove(post);
  }
}
