export class Board {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(
        id: number,
        title: string,
        description: string,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date | null = null,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
