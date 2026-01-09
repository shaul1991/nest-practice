import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

/**
 * Unit Test: BoardService
 * - 의존성 없이 독립적으로 테스트
 * - 각 메서드의 단위 동작 검증
 */
describe('BoardService (Unit)', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardService],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a board', () => {
      const createBoardDto: CreateBoardDto = {
        title: '테스트 게시판',
        description: '테스트 설명',
      };

      const board = service.create(createBoardDto);

      expect(board).toBeDefined();
      expect(board.id).toBe(1);
      expect(board.title).toBe(createBoardDto.title);
      expect(board.description).toBe(createBoardDto.description);
      expect(board.createdAt).toBeInstanceOf(Date);
      expect(board.updatedAt).toBeInstanceOf(Date);
      expect(board.deletedAt).toBeNull();
    });

    it('should increment id for each new board', () => {
      const createBoardDto: CreateBoardDto = {
        title: '게시판 1',
        description: '설명 1',
      };

      const board1 = service.create(createBoardDto);
      const board2 = service.create({
        title: '게시판 2',
        description: '설명 2',
      });

      expect(board1.id).toBe(1);
      expect(board2.id).toBe(2);
    });
  });

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      const boards = service.findAll();
      expect(boards).toEqual([]);
    });

    it('should return all non-deleted boards', () => {
      service.create({ title: '게시판 1', description: '설명 1' });
      service.create({ title: '게시판 2', description: '설명 2' });

      const boards = service.findAll();
      expect(boards.length).toBe(2);
    });

    it('should not return deleted boards', () => {
      const board1 = service.create({
        title: '게시판 1',
        description: '설명 1',
      });
      service.create({ title: '게시판 2', description: '설명 2' });

      service.remove(board1.id);
      const boards = service.findAll();

      expect(boards.length).toBe(1);
      expect(boards[0].id).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a board by id', () => {
      const createdBoard = service.create({
        title: '테스트 게시판',
        description: '테스트 설명',
      });

      const board = service.findOne(createdBoard.id);

      expect(board).toBeDefined();
      expect(board.id).toBe(createdBoard.id);
      expect(board.title).toBe(createdBoard.title);
    });

    it('should throw NotFoundException for non-existent board', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('Board with ID 999 not found');
    });

    it('should throw NotFoundException for deleted board', () => {
      const board = service.create({
        title: '게시판',
        description: '설명',
      });

      service.remove(board.id);

      expect(() => service.findOne(board.id)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update board title', () => {
      const board = service.create({
        title: '원래 제목',
        description: '설명',
      });
      const updateDto: UpdateBoardDto = { title: '수정된 제목' };

      // 약간의 지연을 추가하여 updatedAt이 변경되도록 함
      const beforeUpdate = new Date();
      const updatedBoard = service.update(board.id, updateDto);
      const afterUpdate = new Date();

      expect(updatedBoard.title).toBe('수정된 제목');
      expect(updatedBoard.description).toBe('설명');
      expect(updatedBoard.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(updatedBoard.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
    });

    it('should update board description', () => {
      const board = service.create({
        title: '제목',
        description: '원래 설명',
      });
      const updateDto: UpdateBoardDto = { description: '수정된 설명' };

      const updatedBoard = service.update(board.id, updateDto);

      expect(updatedBoard.description).toBe('수정된 설명');
      expect(updatedBoard.title).toBe('제목');
    });

    it('should update both title and description', () => {
      const board = service.create({
        title: '원래 제목',
        description: '원래 설명',
      });
      const updateDto: UpdateBoardDto = {
        title: '수정된 제목',
        description: '수정된 설명',
      };

      const updatedBoard = service.update(board.id, updateDto);

      expect(updatedBoard.title).toBe('수정된 제목');
      expect(updatedBoard.description).toBe('수정된 설명');
    });

    it('should throw NotFoundException when updating non-existent board', () => {
      const updateDto: UpdateBoardDto = { title: '수정된 제목' };

      expect(() => service.update(999, updateDto)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a board', () => {
      const board = service.create({
        title: '게시판',
        description: '설명',
      });

      service.remove(board.id);

      const deletedBoard = service['boards'].find((b) => b.id === board.id);
      expect(deletedBoard?.deletedAt).toBeInstanceOf(Date);
      expect(() => service.findOne(board.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent board', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
