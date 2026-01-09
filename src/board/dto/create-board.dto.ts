/**
 * DTO: CreateBoardDto (게시판 생성 데이터 전송 객체)
 *
 * DTO (Data Transfer Object)는 계층 간 데이터 전송을 위한 객체입니다.
 * - 클라이언트에서 서버로 전송되는 데이터의 구조를 정의합니다
 * - API 계약(contract)을 명확히 합니다
 * - 입력 검증(validation)의 기준이 됩니다
 *
 * 왜 DTO를 사용하나요?
 * 1. API 계약 명확화: 클라이언트가 어떤 데이터를 보내야 하는지 명확합니다
 * 2. 타입 안정성: TypeScript의 타입 체크를 활용할 수 있습니다
 * 3. 보안: 내부 엔티티 구조를 노출하지 않습니다
 * 4. 유연성: 엔티티와 독립적으로 API를 변경할 수 있습니다
 *
 * CreateBoardDto는 게시판 생성 시 필요한 최소한의 필드만 포함합니다.
 * - id는 서버에서 자동 생성되므로 포함하지 않습니다
 * - createdAt, updatedAt 등은 서버에서 자동 설정되므로 포함하지 않습니다
 */
export class CreateBoardDto {
  /**
   * 게시판 제목
   * - 필수 필드
   * - 클라이언트가 반드시 제공해야 하는 값
   */
  title: string;

  /**
   * 게시판 설명
   * - 필수 필드
   * - 게시판의 목적이나 설명
   */
  description: string;
}
