import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

/**
 * Service: BoardService (게시판 비즈니스 로직 서비스)
 *
 * Service는 비즈니스 로직을 담당하는 클래스입니다.
 * - Controller는 HTTP 요청/응답만 처리하고, 실제 비즈니스 로직은 Service에서 처리합니다
 * - 재사용 가능한 비즈니스 로직을 제공합니다
 * - 다른 Service나 Module에서도 사용할 수 있습니다
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
   * 게시판 데이터 저장소 (메모리 기반)
   * - private: 클래스 외부에서 직접 접근 불가
   * - 현재는 메모리 배열을 사용하지만, 실제로는 데이터베이스와 연동됩니다
   * - 데이터베이스 연동 시 Repository 패턴을 사용합니다
   */
  private boards: Board[] = [];

  /**
   * 다음 게시판 ID (자동 증가)
   * - 새로운 게시판 생성 시 사용됩니다
   * - 데이터베이스 사용 시에는 AUTO_INCREMENT를 사용합니다
   */
  private nextId = 1;

  /**
   * 게시판 생성
   *
   * @param createBoardDto - 생성할 게시판 정보 (제목, 설명)
   * @returns 생성된 게시판 엔티티
   *
   * 비즈니스 로직:
   * 1. 고유 ID 할당 (자동 증가)
   * 2. 생성/수정 일시 설정
   * 3. 삭제 상태는 null로 초기화
   * 4. 메모리 저장소에 추가
   */
  create(createBoardDto: CreateBoardDto): Board {
    // 현재 시각을 생성/수정 일시로 사용
    const now = new Date();

    // 새로운 게시판 엔티티 생성
    const board = new Board(
      this.nextId++, // ID 자동 증가
      createBoardDto.title,
      createBoardDto.description,
      now, // createdAt
      now, // updatedAt (생성 시에는 생성일시와 동일)
      null, // deletedAt (삭제되지 않음)
    );

    // 메모리 저장소에 추가
    this.boards.push(board);
    return board;
  }

  /**
   * 모든 게시판 조회 (삭제되지 않은 것만)
   *
   * @returns 삭제되지 않은 모든 게시판 배열
   *
   * Soft Delete 처리:
   * - deletedAt이 null인 게시판만 반환합니다
   * - 실제로 삭제된 데이터는 조회되지 않습니다
   */
  findAll(): Board[] {
    return this.boards.filter((board) => board.deletedAt === null);
  }

  /**
   * ID로 게시판 조회
   *
   * @param id - 조회할 게시판 ID
   * @returns 조회된 게시판 엔티티
   * @throws NotFoundException - 게시판이 없거나 삭제된 경우
   *
   * 예외 처리:
   * - 게시판이 없거나 삭제된 경우 NotFoundException을 던집니다
   * - HTTP 상태 코드 404로 변환됩니다
   */
  findOne(id: number): Board {
    // ID와 일치하고 삭제되지 않은 게시판 찾기
    const board = this.boards.find((b) => b.id === id && b.deletedAt === null);

    // 게시판이 없으면 예외 발생
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
   * - updatedAt은 항상 현재 시각으로 갱신됩니다
   */
  update(id: number, updateBoardDto: UpdateBoardDto): Board {
    // 게시판 조회 (없으면 예외 발생)
    const board = this.findOne(id);

    // 수정 일시 갱신
    const now = new Date();

    // 제목이 제공된 경우에만 업데이트
    // undefined와 null을 구분하여 명시적으로 null을 전달한 경우도 처리
    if (updateBoardDto.title !== undefined && updateBoardDto.title !== null) {
      board.title = updateBoardDto.title;
    }

    // 설명이 제공된 경우에만 업데이트
    if (
      updateBoardDto.description !== undefined &&
      updateBoardDto.description !== null
    ) {
      board.description = updateBoardDto.description;
    }

    // 수정 일시 갱신 (항상 현재 시각으로)
    board.updatedAt = now;

    return board;
  }

  /**
   * 게시판 삭제 (Soft Delete)
   *
   * @param id - 삭제할 게시판 ID
   *
   * Soft Delete:
   * - 실제로 데이터를 삭제하지 않고 deletedAt에 현재 시각을 기록합니다
   * - 데이터 복구가 가능합니다
   * - 참조 무결성을 유지할 수 있습니다
   */
  remove(id: number): void {
    // 게시판 조회 (없으면 예외 발생)
    const board = this.findOne(id);

    // Soft Delete: deletedAt에 현재 시각 기록
    board.deletedAt = new Date();
  }
}
