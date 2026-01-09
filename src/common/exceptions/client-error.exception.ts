import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * ClientErrorException: 클라이언트 에러 (4xx)
 * 
 * 클라이언트의 잘못된 요청으로 인한 에러
 */
export class ClientErrorException extends BaseException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode?: string,
  ) {
    super(message, statusCode, errorCode);
  }
}

/**
 * 자주 사용되는 4xx 에러들
 */
export class BadRequestException extends ClientErrorException {
  constructor(message: string = '잘못된 요청입니다', errorCode?: string) {
    super(message, HttpStatus.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedException extends ClientErrorException {
  constructor(message: string = '인증이 필요합니다', errorCode?: string) {
    super(message, HttpStatus.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenException extends ClientErrorException {
  constructor(message: string = '접근 권한이 없습니다', errorCode?: string) {
    super(message, HttpStatus.FORBIDDEN, errorCode);
  }
}

export class NotFoundException extends ClientErrorException {
  constructor(message: string = '리소스를 찾을 수 없습니다', errorCode?: string) {
    super(message, HttpStatus.NOT_FOUND, errorCode);
  }
}

export class ConflictException extends ClientErrorException {
  constructor(message: string = '리소스 충돌이 발생했습니다', errorCode?: string) {
    super(message, HttpStatus.CONFLICT, errorCode);
  }
}
