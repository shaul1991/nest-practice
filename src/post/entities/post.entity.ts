/**
 * Entity: Post (게시글 엔티티)
 *
 * Post는 Board(게시판)에 속한 게시글을 나타내는 도메인 모델입니다.
 * - Board와의 관계: 여러 게시글이 하나의 게시판에 속합니다 (다대일 관계)
 * - boardId를 통해 어떤 게시판에 속하는지 식별합니다
 *
 * 관계형 데이터베이스 관점:
 * - Post 테이블의 boardId는 Board 테이블의 id를 참조합니다 (Foreign Key)
 * - 현재는 메모리 저장소를 사용하지만, 실제로는 데이터베이스 제약조건으로 관리됩니다
 */
export class Post {
    /**
     * 게시글 고유 식별자
     * - Primary Key 역할
     */
    id: number;

    /**
     * 소속 게시판 ID (Foreign Key)
     * - 이 게시글이 속한 게시판을 식별합니다
     * - Board 엔티티의 id를 참조합니다
     * - 게시글 생성 시 반드시 유효한 boardId여야 합니다
     */
    boardId: number;

    /**
     * 게시글 제목
     * - 사용자가 입력하는 게시글의 제목
     */
    title: string;

    /**
     * 게시글 내용
     * - 게시글의 본문 내용
     */
    content: string;

    /**
     * 생성 일시
     * - 게시글이 생성된 시점
     */
    createdAt: Date;

    /**
     * 수정 일시
     * - 게시글이 마지막으로 수정된 시점
     */
    updatedAt: Date;

    /**
     * 삭제 일시 (Soft Delete)
     * - null: 삭제되지 않음
     * - Date: 삭제된 시점
     */
    deletedAt: Date | null;

    /**
     * Post 엔티티 생성자
     *
     * @param id - 게시글 고유 식별자
     * @param boardId - 소속 게시판 ID
     * @param title - 게시글 제목
     * @param content - 게시글 내용
     * @param createdAt - 생성 일시
     * @param updatedAt - 수정 일시
     * @param deletedAt - 삭제 일시 (기본값: null)
     */
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
