import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardModule } from './board.module';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

/**
 * Integration Test: BoardService
 * - 실제 모듈을 사용하여 통합 테스트
 * - 전체 흐름과 상호작용 검증
 */
describe('BoardService (Integration)', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BoardModule],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  describe('CRUD operations flow', () => {
    it('should perform complete CRUD operations', () => {
      // Create
      const createDto: CreateBoardDto = {
        title: '통합 테스트 게시판',
        description: '통합 테스트 설명',
      };
      const board = service.create(createDto);

      expect(board.id).toBe(1);
      expect(board.title).toBe(createDto.title);
      expect(board.description).toBe(createDto.description);

      // Read - findAll
      const allBoards = service.findAll();
      expect(allBoards.length).toBe(1);
      expect(allBoards[0].id).toBe(board.id);

      // Read - findOne
      const foundBoard = service.findOne(board.id);
      expect(foundBoard.id).toBe(board.id);
      expect(foundBoard.title).toBe(board.title);

      // Update
      const updateDto: UpdateBoardDto = {
        title: '수정된 제목',
        description: '수정된 설명',
      };
      const updatedBoard = service.update(board.id, updateDto);
      expect(updatedBoard.title).toBe(updateDto.title);
      expect(updatedBoard.description).toBe(updateDto.description);

      // Verify update in findAll
      const updatedAllBoards = service.findAll();
      expect(updatedAllBoards[0].title).toBe(updateDto.title);

      // Delete (soft delete)
      service.remove(board.id);

      // Verify deletion
      expect(() => service.findOne(board.id)).toThrow(NotFoundException);
      const boardsAfterDelete = service.findAll();
      expect(boardsAfterDelete.length).toBe(0);
    });

    it('should handle multiple boards correctly', () => {
      const board1 = service.create({
        title: '게시판 1',
        description: '설명 1',
      });
      const board2 = service.create({
        title: '게시판 2',
        description: '설명 2',
      });
      const board3 = service.create({
        title: '게시판 3',
        description: '설명 3',
      });

      const allBoards = service.findAll();
      expect(allBoards.length).toBe(3);

      // Update one board
      service.update(board2.id, { title: '수정된 게시판 2' });
      const updatedBoard2 = service.findOne(board2.id);
      expect(updatedBoard2.title).toBe('수정된 게시판 2');

      // Delete one board
      service.remove(board1.id);
      const remainingBoards = service.findAll();
      expect(remainingBoards.length).toBe(2);
      expect(remainingBoards.map((b) => b.id)).toEqual([board2.id, board3.id]);
    });

    it('should maintain data consistency across operations', () => {
      const board = service.create({
        title: '일관성 테스트',
        description: '설명',
      });

      const originalCreatedAt = board.createdAt;
      const originalUpdatedAt = board.updatedAt;

      // Update should change updatedAt but not createdAt
      const beforeUpdate = new Date();
      service.update(board.id, { title: '수정' });
      const updatedBoard = service.findOne(board.id);
      const afterUpdate = new Date();

      expect(updatedBoard.createdAt.getTime()).toBe(
        originalCreatedAt.getTime(),
      );
      expect(updatedBoard.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
      expect(updatedBoard.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(updatedBoard.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
    });
  });
});
