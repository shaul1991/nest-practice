import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { Post } from '../post/entities/post.entity';

/**
 * Service: BoardService (게시판 비즈니스 로직 서비스)
 *
 * Service는 비즈니스 로직을 담당하는 클래스입니다.
 * - Controller는 HTTP 요청/응답만 처리하고, 실제 비즈니스 로직은 Service에서 처리합니다
 * - 재사용 가능한 비즈니스 로직을 제공합니다
 * - 다른 Service나 Module에서도 사용할 수 있습니다
 *
 * Repository 패턴:
 * - TypeORM의 Repository를 사용하여 데이터베이스 작업을 수행합니다
 * - 데이터 접근 로직을 캡슐화합니다
 * - 테스트 시 Mock Repository를 쉽게 주입할 수 있습니다
 *
 * @Injectable() 데코레이터의 역할:
 * 1. NestJS의 의존성 주입(DI) 시스템에 등록합니다
 * 2. 다른 클래스에서 이 서비스를 주입받을 수 있게 합니다
 * 3. 싱글톤 패턴으로 관리됩니다 (앱 전체에서 하나의 인스턴스만 생성)
 *
 * 왜 Service를 분리하나요?
 * 1. 관심사 분리: Controller는 HTTP 처리, Service는 비즈니스 로직
 * 2. 테스트 용이성: Service를 독립적으로 테스트할 수 있습니다
 * 3. 재사용성: 여러 Controller에서 같은 Service를 사용할 수 있습니다
 * 4. 유지보수성: 비즈니스 로직 변경 시 Service만 수정하면 됩니다
 */
@Injectable()
export class BoardService {
  /**
   * TypeORM Repository
   * - @InjectRepository(): TypeORM Repository를 주입받습니다
   * - Repository<Board>: Board 엔티티에 대한 Repository 타입
   * - 데이터베이스 CRUD 작업을 수행합니다
   *
   * Repository의 주요 메서드:
   * - save(): 생성 또는 업데이트
   * - find(): 조회 (조건부)
   * - findOne(): 단일 레코드 조회
   * - remove(): 삭제 (Soft Delete는 softRemove 사용)
   * - softRemove(): Soft Delete
   */
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) { }

  /**
   * 게시판 생성
   *
   * @param createBoardDto - 생성할 게시판 정보 (제목, 설명)
   * @returns 생성된 게시판 엔티티
   *
   * TypeORM의 save() 메서드:
   * - 엔티티를 생성하고 데이터베이스에 저장합니다
   * - @CreateDateColumn()과 @UpdateDateColumn()이 자동으로 설정됩니다
   * - ID는 데이터베이스에서 자동 생성됩니다 (SERIAL)
   */
  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    // 새로운 게시판 엔티티 생성
    const board = this.boardRepository.create({
      title: createBoardDto.title,
      description: createBoardDto.description,
    });

    // 데이터베이스에 저장
    // save()는 Promise를 반환하므로 await 사용
    return await this.boardRepository.save(board);
  }

  /**
   * 모든 게시판 조회 (삭제되지 않은 것만)
   *
   * @returns 삭제되지 않은 모든 게시판 배열
   *
   * TypeORM의 find() 메서드:
   * - @DeleteDateColumn()이 있는 경우 자동으로 deletedAt이 null인 레코드만 조회합니다
   * - Soft Delete가 자동으로 처리됩니다
   * - 조건이 없으면 모든 활성 레코드를 반환합니다
   */
  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  /**
   * ID로 게시판 조회
   *
   * @param id - 조회할 게시판 ID
   * @returns 조회된 게시판 엔티티
   * @throws NotFoundException - 게시판이 없거나 삭제된 경우
   *
   * TypeORM의 findOne() 메서드:
   * - where 조건으로 ID를 지정합니다
   * - @DeleteDateColumn()이 있으면 자동으로 deletedAt이 null인 레코드만 조회합니다
   * - 레코드가 없으면 null을 반환합니다
   */
  async findOne(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  /**
   * 게시판 수정
   *
   * @param id - 수정할 게시판 ID
   * @param updateBoardDto - 수정할 정보 (제목, 설명 - 선택적)
   * @returns 수정된 게시판 엔티티
   *
   * 부분 업데이트 (Partial Update):
   * - updateBoardDto의 필드는 모두 선택적입니다
   * - undefined나 null이 아닌 필드만 업데이트합니다
   * - @UpdateDateColumn()이 자동으로 updatedAt을 갱신합니다
   *
   * TypeORM의 save() 메서드:
   * - 엔티티에 id가 있으면 업데이트, 없으면 생성합니다
   * - 부분 업데이트를 위해 Object.assign()을 사용합니다
   */
  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    // 게시판 조회 (없으면 예외 발생)
    const board = await this.findOne(id);

    // 부분 업데이트: 제공된 필드만 업데이트
    Object.assign(board, updateBoardDto);

    // 데이터베이스에 저장 (업데이트)
    // @UpdateDateColumn()이 자동으로 updatedAt을 갱신합니다
    return await this.boardRepository.save(board);
  }

  /**
   * 게시판 삭제 (Soft Delete)
   *
   * @param id - 삭제할 게시판 ID
   *
   * TypeORM의 softRemove() 메서드:
   * - @DeleteDateColumn()이 있는 엔티티의 Soft Delete를 수행합니다
   * - deletedAt에 현재 시각을 자동으로 설정합니다
   * - 실제로 데이터베이스에서 삭제되지 않고 표시만 됩니다
   *
   * Soft Delete의 장점:
   * - 데이터 복구 가능
   * - 감사 추적 가능
   * - 참조 무결성 유지
   */
  async remove(id: number): Promise<void> {
    // 게시판 조회 (없으면 예외 발생)
    const board = await this.findOne(id);

    // Soft Delete: deletedAt에 현재 시각 설정
    await this.boardRepository.softRemove(board);
  }

  async searchPostsByBoard(id: number): Promise<Post[]> {
    return await this.postRepository.find({
      where: { board_id: id },
    });
  }
}
