import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

/**
 * Entity: Board (게시판 엔티티)
 *
 * TypeORM Entity는 데이터베이스 테이블과 매핑되는 클래스입니다.
 * - @Entity() 데코레이터로 데이터베이스 테이블을 정의합니다
 * - 각 속성은 @Column() 데코레이터로 데이터베이스 컬럼과 매핑됩니다
 * - TypeORM이 자동으로 SQL을 생성하고 실행합니다
 *
 * TypeORM을 사용하는 이유:
 * 1. 객체-관계 매핑(ORM): SQL을 직접 작성하지 않고 객체로 데이터베이스를 다룹니다
 * 2. 타입 안정성: TypeScript의 타입 체크를 활용할 수 있습니다
 * 3. 마이그레이션: 데이터베이스 스키마 변경을 버전 관리할 수 있습니다
 * 4. 관계 관리: 엔티티 간 관계를 쉽게 정의하고 사용할 수 있습니다
 */
@Entity('boards')
export class Board {
    /**
     * 게시판 고유 식별자
     * - Primary Key 역할
     * - @PrimaryGeneratedColumn(): 자동 증가하는 기본 키
     * - 데이터베이스에서 자동으로 생성됩니다 (SERIAL 또는 AUTO_INCREMENT)
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 게시판 제목
     * - @Column(): 일반 컬럼으로 매핑
     * - 사용자가 입력하는 게시판의 이름
     */
    @Column()
    title: string;

    /**
     * 게시판 설명
     * - 게시판의 목적이나 설명을 담는 필드
     */
    @Column()
    description: string;

    /**
     * 생성 일시
     * - @CreateDateColumn(): 생성 시 자동으로 현재 시각이 설정됩니다
     * - TypeORM이 자동으로 관리합니다
     * - 감사(audit) 목적으로 사용됩니다
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * 수정 일시
     * - @UpdateDateColumn(): 업데이트 시마다 자동으로 현재 시각으로 갱신됩니다
     * - TypeORM이 자동으로 관리합니다
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * 삭제 일시 (Soft Delete)
     * - @DeleteDateColumn(): Soft Delete를 위한 특수 컬럼
     * - 삭제 시 자동으로 현재 시각이 설정됩니다
     * - null: 삭제되지 않음
     * - Date: 삭제된 시점
     *
     * Soft Delete를 사용하는 이유:
     * 1. 데이터 복구 가능: 실수로 삭제한 경우 복구할 수 있습니다
     * 2. 감사 추적: 삭제된 데이터도 언제 삭제되었는지 추적 가능합니다
     * 3. 참조 무결성: 다른 데이터가 참조하는 경우에도 안전합니다
     *
     * TypeORM의 Soft Delete:
     * - find() 메서드는 자동으로 deletedAt이 null인 레코드만 조회합니다
     * - withDeleted() 옵션으로 삭제된 레코드도 조회할 수 있습니다
     */
    @DeleteDateColumn()
    deletedAt: Date | null;
}
