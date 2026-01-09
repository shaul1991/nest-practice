/**
 * Entity: Board (게시판 엔티티)
 *
 * Entity는 도메인 모델을 나타내는 클래스입니다.
 * - 비즈니스 로직의 핵심 데이터 구조를 정의합니다
 * - 데이터베이스 테이블과 매핑될 수 있는 구조입니다 (현재는 메모리 저장소 사용)
 * - 도메인 규칙과 비즈니스 로직을 포함할 수 있습니다
 *
 * 왜 Entity를 사용하나요?
 * 1. 도메인 모델과 데이터 전송 객체(DTO)를 분리하여 관심사를 분리합니다
 * 2. 비즈니스 로직의 변경이 API 계약에 영향을 주지 않도록 합니다
 * 3. 재사용 가능한 도메인 모델을 제공합니다
 */
export class Board {
    /**
     * 게시판 고유 식별자
     * - Primary Key 역할
     * - 각 게시판을 구분하는 유일한 값
     */
    id: number;

    /**
     * 게시판 제목
     * - 사용자가 입력하는 게시판의 이름
     */
    title: string;

    /**
     * 게시판 설명
     * - 게시판의 목적이나 설명을 담는 필드
     */
    description: string;

    /**
     * 생성 일시
     * - 게시판이 생성된 시점을 기록
     * - 감사(audit) 목적으로 사용됩니다
     */
    createdAt: Date;

    /**
     * 수정 일시
     * - 게시판 정보가 마지막으로 수정된 시점
     * - 업데이트 시마다 자동으로 갱신됩니다
     */
    updatedAt: Date;

    /**
     * 삭제 일시 (Soft Delete)
     * - null: 삭제되지 않음
     * - Date: 삭제된 시점
     *
     * Soft Delete를 사용하는 이유:
     * 1. 데이터 복구 가능: 실수로 삭제한 경우 복구할 수 있습니다
     * 2. 감사 추적: 삭제된 데이터도 언제 삭제되었는지 추적 가능합니다
     * 3. 참조 무결성: 다른 데이터가 참조하는 경우에도 안전합니다
     */
    deletedAt: Date | null;

    /**
     * Board 엔티티 생성자
     *
     * @param id - 게시판 고유 식별자
     * @param title - 게시판 제목
     * @param description - 게시판 설명
     * @param createdAt - 생성 일시
     * @param updatedAt - 수정 일시
     * @param deletedAt - 삭제 일시 (기본값: null)
     *
     * 생성자를 사용하는 이유:
     * - 객체 생성 시 모든 필수 필드를 명시적으로 설정하도록 강제합니다
     * - 타입 안정성을 보장합니다
     */
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
