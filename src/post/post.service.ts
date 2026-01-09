import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { BoardService } from '../board/board.service';

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private nextId = 1;

  constructor(private readonly boardService: BoardService) {}

  create(createPostDto: CreatePostDto): Post {
    // boardId 유효성 검사
    try {
      this.boardService.findOne(createPostDto.boardId);
    } catch (error) {
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

  findAll(boardId?: number): Post[] {
    if (boardId !== undefined) {
      return this.posts.filter(
        (post) => post.boardId === boardId && post.deletedAt === null,
      );
    }
    return this.posts.filter((post) => post.deletedAt === null);
  }

  findOne(id: number): Post {
    const post = this.posts.find(
      (p) => p.id === id && p.deletedAt === null,
    );
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto): Post {
    const post = this.findOne(id);
    const now = new Date();

    if (updatePostDto.title !== undefined && updatePostDto.title !== null) {
      post.title = updatePostDto.title;
    }
    if (
      updatePostDto.content !== undefined &&
      updatePostDto.content !== null
    ) {
      post.content = updatePostDto.content;
    }
    post.updatedAt = now;

    return post;
  }

  remove(id: number): void {
    const post = this.findOne(id);
    post.deletedAt = new Date();
  }
}
