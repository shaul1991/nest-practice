import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Board } from '../../board/entities/board.entity';

/**
 * Entity: Post (게시글 엔티티)
 *
 * Post는 Board(게시판)에 속한 게시글을 나타내는 TypeORM 엔티티입니다.
 * - Board와의 관계: 여러 게시글이 하나의 게시판에 속합니다 (다대일 관계)
 * - @ManyToOne(): 여러 Post가 하나의 Board에 속하는 관계
 *
 * 관계형 데이터베이스 관점:
 * - Post 테이블의 boardId는 Board 테이블의 id를 참조합니다 (Foreign Key)
 * - TypeORM이 자동으로 Foreign Key 제약조건을 생성합니다
 */
@Entity('posts')
@Index('idx_board', ['board_id'])
export class Post {
    /**
     * 게시글 고유 식별자
     * - Primary Key 역할
     * - 자동 증가하는 기본 키
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 소속 게시판 ID
     * - 이 게시글이 속한 게시판을 식별합니다
     * - Board 엔티티의 id를 참조합니다
     * - 게시글 생성 시 반드시 유효한 board_id여야 합니다
     */
    @Column()
    board_id: number;

    /**
     * 게시판 관계 (Many-to-One)
     * - @ManyToOne(): 여러 Post가 하나의 Board에 속함
     * - @JoinColumn(): Foreign Key 컬럼 이름 지정 (boardId)
     * - 관계를 통해 Board 객체에 직접 접근할 수 있습니다
     *
     * 사용 예시:
     * - const post = await postRepository.findOne({ relations: ['board'] });
     * - console.log(post.board.title); // 게시판 제목 접근
     */
    @ManyToOne(() => Board, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'board_id' })
    board: Board;

    /**
     * 게시글 제목
     * - 사용자가 입력하는 게시글의 제목
     */
    @Column()
    title: string;

    /**
     * 게시글 내용
     * - 게시글의 본문 내용
     * - @Column('text'): TEXT 타입으로 저장 (긴 내용 지원)
     */
    @Column('text')
    content: string;

    /**
     * 생성 일시
     * - 생성 시 자동으로 현재 시각이 설정됩니다
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * 수정 일시
     * - 업데이트 시마다 자동으로 현재 시각으로 갱신됩니다
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * 삭제 일시 (Soft Delete)
     * - 삭제 시 자동으로 현재 시각이 설정됩니다
     * - null: 삭제되지 않음
     * - Date: 삭제된 시점
     */
    @DeleteDateColumn()
    deletedAt: Date | null;
}
