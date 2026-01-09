import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * BaseException: 커스텀 예외의 기본 클래스
 * 
 * 4xx (클라이언트 에러)와 5xx (서버 에러)를 구분하여 처리합니다.
 */
export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode?: string,
  ) {
    super(
      {
        message,
        errorCode,
        statusCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  /**
   * 4xx 에러인지 확인
   */
  isClientError(): boolean {
    const status = this.getStatus();
    return status >= 400 && status < 500;
  }

  /**
   * 5xx 에러인지 확인
   */
  isServerError(): boolean {
    const status = this.getStatus();
    return status >= 500 && status < 600;
  }
}
