/**
 * DTO: CreatePostDto (게시글 생성 데이터 전송 객체)
 *
 * 게시글 생성 시 필요한 데이터를 정의합니다.
 * - boardId: 게시글이 속할 게시판을 지정합니다
 * - title, content: 게시글의 제목과 내용입니다
 *
 * boardId가 필요한 이유:
 * - 게시글은 반드시 게시판에 속해야 합니다
 * - 게시판이 없으면 게시글을 생성할 수 없습니다
 * - Service에서 boardId의 유효성을 검증합니다
 */
export class CreatePostDto {
  /**
   * 소속 게시판 ID
   * - 필수 필드
   * - 유효한 게시판 ID여야 합니다 (Service에서 검증)
   */
  boardId: number;

  /**
   * 게시글 제목
   * - 필수 필드
   */
  title: string;

  /**
   * 게시글 내용
   * - 필수 필드
   */
  content: string;
}
