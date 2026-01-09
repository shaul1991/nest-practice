/**
 * DTO: UpdateBoardDto (게시판 수정 데이터 전송 객체)
 *
 * 업데이트용 DTO는 모든 필드를 선택적(optional)으로 만듭니다.
 * - 클라이언트는 변경하고 싶은 필드만 전송할 수 있습니다
 * - 부분 업데이트(Partial Update)를 지원합니다
 *
 * 왜 모든 필드를 optional로 하나요?
 * 1. 유연성: 클라이언트가 필요한 필드만 수정할 수 있습니다
 * 2. 네트워크 효율: 변경하지 않는 필드를 전송할 필요가 없습니다
 * 3. 사용자 경험: 폼에서 일부 필드만 수정해도 됩니다
 *
 * 예시:
 * - 제목만 변경: { title: "새 제목" }
 * - 설명만 변경: { description: "새 설명" }
 * - 둘 다 변경: { title: "새 제목", description: "새 설명" }
 */
export class UpdateBoardDto {
  /**
   * 게시판 제목
   * - 선택적 필드 (optional)
   * - 제공된 경우에만 제목이 업데이트됩니다
   */
  title?: string;

  /**
   * 게시판 설명
   * - 선택적 필드 (optional)
   * - 제공된 경우에만 설명이 업데이트됩니다
   */
  description?: string;
}
