import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * ServerErrorException: 서버 에러 (5xx)
 * 
 * 서버 내부의 문제로 인한 에러
 */
export class ServerErrorException extends BaseException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode?: string,
  ) {
    super(message, statusCode, errorCode);
  }
}

/**
 * 자주 사용되는 5xx 에러들
 */
export class InternalServerErrorException extends ServerErrorException {
  constructor(message: string = '서버 내부 오류가 발생했습니다', errorCode?: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, errorCode);
  }
}

export class NotImplementedException extends ServerErrorException {
  constructor(message: string = '구현되지 않은 기능입니다', errorCode?: string) {
    super(message, HttpStatus.NOT_IMPLEMENTED, errorCode);
  }
}

export class ServiceUnavailableException extends ServerErrorException {
  constructor(message: string = '서비스를 사용할 수 없습니다', errorCode?: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, errorCode);
  }
}

export class GatewayTimeoutException extends ServerErrorException {
  constructor(message: string = '게이트웨이 타임아웃이 발생했습니다', errorCode?: string) {
    super(message, HttpStatus.GATEWAY_TIMEOUT, errorCode);
  }
}
