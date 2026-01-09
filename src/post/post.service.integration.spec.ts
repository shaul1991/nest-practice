import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { BoardService } from '../board/board.service';
import { PostModule } from './post.module';
import { BoardModule } from '../board/board.module';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

/**
 * Integration Test: PostService
 * - 실제 BoardService와 함께 통합 테스트
 * - 두 서비스 간의 상호작용 검증
 */
describe('PostService (Integration)', () => {
  let postService: PostService;
  let boardService: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BoardModule, PostModule],
    }).compile();

    postService = module.get<PostService>(PostService);
    boardService = module.get<BoardService>(BoardService);
  });

  describe('Post-Board integration', () => {
    it('should create post with valid board', () => {
      const board = boardService.create({
        title: '통합 테스트 게시판',
        description: '설명',
      });

      const createPostDto: CreatePostDto = {
        boardId: board.id,
        title: '통합 테스트 게시글',
        content: '통합 테스트 내용',
      };

      const post = postService.create(createPostDto);

      expect(post).toBeDefined();
      expect(post.boardId).toBe(board.id);
      expect(post.title).toBe(createPostDto.title);
      expect(post.content).toBe(createPostDto.content);
    });

    it('should throw BadRequestException when board does not exist', () => {
      const createPostDto: CreatePostDto = {
        boardId: 999,
        title: '게시글',
        content: '내용',
      };

      expect(() => postService.create(createPostDto)).toThrow(
        BadRequestException,
      );
    });

    it('should filter posts by boardId correctly', () => {
      const board1 = boardService.create({
        title: '게시판 1',
        description: '설명 1',
      });
      const board2 = boardService.create({
        title: '게시판 2',
        description: '설명 2',
      });

      const post1 = postService.create({
        boardId: board1.id,
        title: '게시판 1의 게시글 1',
        content: '내용 1',
      });
      const post2 = postService.create({
        boardId: board1.id,
        title: '게시판 1의 게시글 2',
        content: '내용 2',
      });
      const post3 = postService.create({
        boardId: board2.id,
        title: '게시판 2의 게시글 1',
        content: '내용 3',
      });

      const board1Posts = postService.findAll(board1.id);
      const board2Posts = postService.findAll(board2.id);
      const allPosts = postService.findAll();

      expect(board1Posts.length).toBe(2);
      expect(board1Posts.map((p) => p.id)).toEqual([post1.id, post2.id]);
      expect(board2Posts.length).toBe(1);
      expect(board2Posts[0].id).toBe(post3.id);
      expect(allPosts.length).toBe(3);
    });

    it('should handle board deletion affecting posts', () => {
      const board = boardService.create({
        title: '게시판',
        description: '설명',
      });

      const post1 = postService.create({
        boardId: board.id,
        title: '게시글 1',
        content: '내용 1',
      });
      const post2 = postService.create({
        boardId: board.id,
        title: '게시글 2',
        content: '내용 2',
      });

      // Board 삭제 후에도 post는 존재해야 함 (soft delete이므로)
      boardService.remove(board.id);

      // Board가 삭제되었으므로 새로운 post 생성 시 에러 발생
      expect(() =>
        postService.create({
          boardId: board.id,
          title: '새 게시글',
          content: '내용',
        }),
      ).toThrow(BadRequestException);

      // 기존 post는 여전히 조회 가능
      const foundPost = postService.findOne(post1.id);
      expect(foundPost).toBeDefined();
    });
  });

  describe('Complete CRUD flow with Board dependency', () => {
    it('should perform complete CRUD operations', () => {
      // Create board
      const board = boardService.create({
        title: 'CRUD 테스트 게시판',
        description: '설명',
      });

      // Create post
      const createPostDto: CreatePostDto = {
        boardId: board.id,
        title: 'CRUD 테스트 게시글',
        content: 'CRUD 테스트 내용',
      };
      const post = postService.create(createPostDto);

      expect(post.id).toBe(1);
      expect(post.boardId).toBe(board.id);

      // Read - findAll
      const allPosts = postService.findAll();
      expect(allPosts.length).toBe(1);

      // Read - findAll by boardId
      const boardPosts = postService.findAll(board.id);
      expect(boardPosts.length).toBe(1);
      expect(boardPosts[0].id).toBe(post.id);

      // Read - findOne
      const foundPost = postService.findOne(post.id);
      expect(foundPost.id).toBe(post.id);
      expect(foundPost.title).toBe(createPostDto.title);

      // Update
      const updateDto: UpdatePostDto = {
        title: '수정된 제목',
        content: '수정된 내용',
      };
      const updatedPost = postService.update(post.id, updateDto);
      expect(updatedPost.title).toBe(updateDto.title);
      expect(updatedPost.content).toBe(updateDto.content);

      // Verify update
      const updatedFoundPost = postService.findOne(post.id);
      expect(updatedFoundPost.title).toBe(updateDto.title);

      // Delete
      postService.remove(post.id);

      // Verify deletion
      expect(() => postService.findOne(post.id)).toThrow(NotFoundException);
      const postsAfterDelete = postService.findAll();
      expect(postsAfterDelete.length).toBe(0);
    });

    it('should maintain referential integrity', () => {
      const board1 = boardService.create({
        title: '게시판 1',
        description: '설명 1',
      });
      const board2 = boardService.create({
        title: '게시판 2',
        description: '설명 2',
      });

      const post1 = postService.create({
        boardId: board1.id,
        title: '게시글 1',
        content: '내용 1',
      });
      const post2 = postService.create({
        boardId: board2.id,
        title: '게시글 2',
        content: '내용 2',
      });

      // 각 post는 올바른 boardId를 가져야 함
      expect(post1.boardId).toBe(board1.id);
      expect(post2.boardId).toBe(board2.id);

      // boardId로 필터링 시 올바른 결과 반환
      const board1Posts = postService.findAll(board1.id);
      expect(board1Posts.length).toBe(1);
      expect(board1Posts[0].id).toBe(post1.id);

      const board2Posts = postService.findAll(board2.id);
      expect(board2Posts.length).toBe(1);
      expect(board2Posts[0].id).toBe(post2.id);
    });
  });
});
