import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { BoardService } from '../board/board.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Board } from '../board/entities/board.entity';

/**
 * Unit Test: PostService
 * - BoardService를 mock으로 대체하여 독립적으로 테스트
 * - PostService의 단위 동작만 검증
 */
describe('PostService (Unit)', () => {
    let service: PostService;
    let boardService: jest.Mocked<BoardService>;

    const mockBoard: Board = {
        id: 1,
        title: '테스트 게시판',
        description: '테스트 설명',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };

    beforeEach(async () => {
        const mockBoardService = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: BoardService,
                    useValue: mockBoardService,
                },
            ],
        }).compile();

        service = module.get<PostService>(PostService);
        boardService = module.get(BoardService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a post when board exists', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const createPostDto: CreatePostDto = {
                boardId: 1,
                title: '테스트 게시글',
                content: '테스트 내용',
            };

            const post = service.create(createPostDto);

            expect(post).toBeDefined();
            expect(post.id).toBe(1);
            expect(post.boardId).toBe(createPostDto.boardId);
            expect(post.title).toBe(createPostDto.title);
            expect(post.content).toBe(createPostDto.content);
            expect(post.createdAt).toBeInstanceOf(Date);
            expect(post.updatedAt).toBeInstanceOf(Date);
            expect(post.deletedAt).toBeNull();
            expect(boardService.findOne).toHaveBeenCalledWith(1);
        });

        it('should throw BadRequestException when board does not exist', () => {
            boardService.findOne.mockImplementation((): Board => {
                throw new NotFoundException('Board not found');
            });
            const createPostDto: CreatePostDto = {
                boardId: 999,
                title: '테스트 게시글',
                content: '테스트 내용',
            };

            expect(() => service.create(createPostDto)).toThrow(BadRequestException);
            expect(() => service.create(createPostDto)).toThrow(
                'Board with ID 999 not found',
            );
            expect(boardService.findOne).toHaveBeenCalledWith(999);
        });

        it('should increment id for each new post', () => {
            boardService.findOne.mockReturnValue(mockBoard);

            const post1 = service.create({
                boardId: 1,
                title: '게시글 1',
                content: '내용 1',
            });
            const post2 = service.create({
                boardId: 1,
                title: '게시글 2',
                content: '내용 2',
            });

            expect(post1.id).toBe(1);
            expect(post2.id).toBe(2);
        });
    });

    describe('findAll', () => {
        it('should return an empty array initially', () => {
            const posts = service.findAll();
            expect(posts).toEqual([]);
        });

        it('should return all non-deleted posts', () => {
            boardService.findOne.mockReturnValue(mockBoard);

            service.create({
                boardId: 1,
                title: '게시글 1',
                content: '내용 1',
            });
            service.create({
                boardId: 1,
                title: '게시글 2',
                content: '내용 2',
            });

            const posts = service.findAll();
            expect(posts.length).toBe(2);
        });

        it('should filter posts by boardId', () => {
            boardService.findOne.mockReturnValue(mockBoard);

            service.create({
                boardId: 1,
                title: '게시글 1',
                content: '내용 1',
            });
            service.create({
                boardId: 2,
                title: '게시글 2',
                content: '내용 2',
            });
            service.create({
                boardId: 1,
                title: '게시글 3',
                content: '내용 3',
            });

            const posts = service.findAll(1);
            expect(posts.length).toBe(2);
            expect(posts.every((post) => post.boardId === 1)).toBe(true);
        });

        it('should not return deleted posts', () => {
            boardService.findOne.mockReturnValue(mockBoard);

            const post1 = service.create({
                boardId: 1,
                title: '게시글 1',
                content: '내용 1',
            });
            service.create({
                boardId: 1,
                title: '게시글 2',
                content: '내용 2',
            });

            service.remove(post1.id);
            const posts = service.findAll();

            expect(posts.length).toBe(1);
            expect(posts[0].id).toBe(2);
        });
    });

    describe('findOne', () => {
        it('should return a post by id', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const createdPost = service.create({
                boardId: 1,
                title: '테스트 게시글',
                content: '테스트 내용',
            });

            const post = service.findOne(createdPost.id);

            expect(post).toBeDefined();
            expect(post.id).toBe(createdPost.id);
            expect(post.title).toBe(createdPost.title);
        });

        it('should throw NotFoundException for non-existent post', () => {
            expect(() => service.findOne(999)).toThrow(NotFoundException);
            expect(() => service.findOne(999)).toThrow('Post with ID 999 not found');
        });

        it('should throw NotFoundException for deleted post', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const post = service.create({
                boardId: 1,
                title: '게시글',
                content: '내용',
            });

            service.remove(post.id);

            expect(() => service.findOne(post.id)).toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update post title', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const post = service.create({
                boardId: 1,
                title: '원래 제목',
                content: '내용',
            });
            const updateDto: UpdatePostDto = { title: '수정된 제목' };

            const beforeUpdate = new Date();
            const updatedPost = service.update(post.id, updateDto);
            const afterUpdate = new Date();

            expect(updatedPost.title).toBe('수정된 제목');
            expect(updatedPost.content).toBe('내용');
            expect(updatedPost.updatedAt.getTime()).toBeGreaterThanOrEqual(
                beforeUpdate.getTime(),
            );
            expect(updatedPost.updatedAt.getTime()).toBeLessThanOrEqual(
                afterUpdate.getTime(),
            );
        });

        it('should update post content', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const post = service.create({
                boardId: 1,
                title: '제목',
                content: '원래 내용',
            });
            const updateDto: UpdatePostDto = { content: '수정된 내용' };

            const updatedPost = service.update(post.id, updateDto);

            expect(updatedPost.content).toBe('수정된 내용');
            expect(updatedPost.title).toBe('제목');
        });

        it('should update both title and content', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const post = service.create({
                boardId: 1,
                title: '원래 제목',
                content: '원래 내용',
            });
            const updateDto: UpdatePostDto = {
                title: '수정된 제목',
                content: '수정된 내용',
            };

            const updatedPost = service.update(post.id, updateDto);

            expect(updatedPost.title).toBe('수정된 제목');
            expect(updatedPost.content).toBe('수정된 내용');
        });

        it('should throw NotFoundException when updating non-existent post', () => {
            const updateDto: UpdatePostDto = { title: '수정된 제목' };

            expect(() => service.update(999, updateDto)).toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should soft delete a post', () => {
            boardService.findOne.mockReturnValue(mockBoard);
            const post = service.create({
                boardId: 1,
                title: '게시글',
                content: '내용',
            });

            service.remove(post.id);

            const deletedPost = service['posts'].find((p) => p.id === post.id);
            expect(deletedPost?.deletedAt).toBeInstanceOf(Date);
            expect(() => service.findOne(post.id)).toThrow(NotFoundException);
        });

        it('should throw NotFoundException when removing non-existent post', () => {
            expect(() => service.remove(999)).toThrow(NotFoundException);
        });
    });
});
