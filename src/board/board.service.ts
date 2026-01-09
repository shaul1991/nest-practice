import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  private boards: Board[] = [];
  private nextId = 1;

  create(createBoardDto: CreateBoardDto): Board {
    const now = new Date();
    const board = new Board(
      this.nextId++,
      createBoardDto.title,
      createBoardDto.description,
      now,
      now,
      null,
    );
    this.boards.push(board);
    return board;
  }

  findAll(): Board[] {
    return this.boards.filter((board) => board.deletedAt === null);
  }

  findOne(id: number): Board {
    const board = this.boards.find((b) => b.id === id && b.deletedAt === null);
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  update(id: number, updateBoardDto: UpdateBoardDto): Board {
    const board = this.findOne(id);
    const now = new Date();

    if (updateBoardDto.title !== undefined && updateBoardDto.title !== null) {
      board.title = updateBoardDto.title;
    }
    if (
      updateBoardDto.description !== undefined &&
      updateBoardDto.description !== null
    ) {
      board.description = updateBoardDto.description;
    }
    board.updatedAt = now;

    return board;
  }

  remove(id: number): void {
    const board = this.findOne(id);
    board.deletedAt = new Date();
  }
}
