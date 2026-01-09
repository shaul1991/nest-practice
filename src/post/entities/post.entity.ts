export class Post {
    id: number;
    boardId: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(
        id: number,
        boardId: number,
        title: string,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date | null = null,
    ) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
