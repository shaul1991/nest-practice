import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

/**
 * Controller: BoardController (게시판 HTTP 요청 처리)
 *
 * Controller는 HTTP 요청을 처리하고 응답을 반환하는 클래스입니다.
 * - 라우팅: URL 경로와 HTTP 메서드를 연결합니다
 * - 요청 파라미터 추출: URL 파라미터, 쿼리 파라미터, 요청 본문 등을 추출합니다
 * - 응답 반환: Service의 결과를 HTTP 응답으로 변환합니다
 *
 * @Controller('boards') 데코레이터:
 * - 이 컨트롤러의 기본 경로를 '/boards'로 설정합니다
 * - 모든 라우트는 '/boards'로 시작합니다
 * - 예: POST /boards, GET /boards, GET /boards/:id 등
 *
 * 왜 Controller를 사용하나요?
 * 1. 관심사 분리: HTTP 처리와 비즈니스 로직을 분리합니다
 * 2. 라우팅: RESTful API를 쉽게 구현할 수 있습니다
 * 3. 미들웨어: 인증, 로깅, 검증 등을 쉽게 추가할 수 있습니다
 * 4. 테스트: HTTP 요청을 모킹하여 테스트할 수 있습니다
 */
@Controller('boards')
export class BoardController {
  /**
   * 의존성 주입 (Dependency Injection)
   *
   * @param boardService - BoardService 인스턴스 (NestJS가 자동 주입)
   *
   * private readonly의 의미:
   * - private: 클래스 내부에서만 접근 가능
   * - readonly: 한 번 할당 후 변경 불가
   *
   * 의존성 주입의 장점:
   * 1. 테스트 용이성: Mock 객체를 쉽게 주입할 수 있습니다
   * 2. 느슨한 결합: Service 구현을 쉽게 변경할 수 있습니다
   * 3. 재사용성: 같은 Service를 여러 Controller에서 사용할 수 있습니다
   */
  constructor(private readonly boardService: BoardService) { }

  /**
   * 게시판 생성
   * HTTP Method: POST
   * Route: POST /boards
   *
   * @param createBoardDto - 요청 본문에서 추출된 게시판 생성 데이터
   * @returns 생성된 게시판 (JSON으로 자동 변환)
   *
   * @Post() 데코레이터:
   * - POST 요청을 처리합니다
   * - 요청 본문을 자동으로 파싱합니다
   *
   * @Body() 데코레이터:
   * - HTTP 요청 본문(request body)을 추출합니다
   * - JSON을 자동으로 CreateBoardDto 객체로 변환합니다
   * - 유효성 검증(validation)을 추가할 수 있습니다
   *
   * 동작 흐름:
   * 1. 클라이언트가 POST /boards 요청
   * 2. NestJS가 요청 본문을 CreateBoardDto로 변환
   * 3. create 메서드 호출
   * 4. Service의 create 메서드 호출
   * 5. 결과를 JSON으로 변환하여 응답
   */
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.create(createBoardDto);
  }

  /**
   * 모든 게시판 조회
   * HTTP Method: GET
   * Route: GET /boards
   *
   * @returns 게시판 배열 (JSON으로 자동 변환)
   *
   * @Get() 데코레이터:
   * - GET 요청을 처리합니다
   * - 경로가 지정되지 않았으므로 기본 경로('/boards')를 사용합니다
   *
   * RESTful API 설계:
   * - GET은 데이터 조회에 사용합니다
   * - 부수 효과(side effect)가 없어야 합니다 (멱등성)
   */
  @Get()
  async findAll() {
    return await this.boardService.findAll();
  }

  /**
   * 특정 게시판 조회
   * HTTP Method: GET
   * Route: GET /boards/:id
   *
   * @param id - URL 파라미터에서 추출된 게시판 ID (문자열)
   * @returns 조회된 게시판 (JSON으로 자동 변환)
   *
   * @Get(':id') 데코레이터:
   * - 경로 파라미터 ':id'를 정의합니다
   * - 예: GET /boards/1 → id = "1"
   *
   * @Param('id') 데코레이터:
   * - URL 파라미터에서 'id' 값을 추출합니다
   * - 문자열로 추출되므로 숫자로 변환(+id)이 필요합니다
   *
   * 라우트 순서 주의:
   * - @Get(':id')는 @Get()보다 뒤에 정의해야 합니다
   * - 그렇지 않으면 '/boards' 요청도 ':id'로 매칭될 수 있습니다
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // 문자열을 숫자로 변환 (+id는 Number(id)와 동일)
    return await this.boardService.findOne(+id);
  }

  /**
   * 게시판 수정
   * HTTP Method: PUT
   * Route: PUT /boards/:id
   *
   * @param id - URL 파라미터에서 추출된 게시판 ID
   * @param updateBoardDto - 요청 본문에서 추출된 수정 데이터
   * @returns 수정된 게시판 (JSON으로 자동 변환)
   *
   * @Put(':id') 데코레이터:
   * - PUT 요청을 처리합니다
   * - PUT은 전체 리소스 교체를 의미하지만, 여기서는 부분 업데이트로 사용합니다
   *
   * PUT vs PATCH:
   * - PUT: 전체 리소스 교체 (일반적으로)
   * - PATCH: 부분 리소스 수정 (일반적으로)
   * - 여기서는 PUT을 부분 업데이트로 사용 (실무에서도 흔함)
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return await this.boardService.update(+id, updateBoardDto);
  }

  /**
   * 게시판 삭제
   * HTTP Method: DELETE
   * Route: DELETE /boards/:id
   *
   * @param id - URL 파라미터에서 추출된 게시판 ID
   * @returns void (204 No Content 응답)
   *
   * @Delete(':id') 데코레이터:
   * - DELETE 요청을 처리합니다
   * - 리소스 삭제를 의미합니다
   *
   * HTTP 상태 코드:
   * - 200 OK: 삭제 성공 (일부 응답 본문 포함)
   * - 204 No Content: 삭제 성공 (응답 본문 없음)
   * - 404 Not Found: 리소스가 없는 경우 (Service에서 NotFoundException 발생 시)
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.boardService.remove(+id);
  }

  /**
   * 특정 게시판의 게시물들 조회
   * HTTP Method: GET
   * Route: GET /boards/:id/posts
   *
   * @param id - URL 파라미터에서 추출된 게시판 ID (문자열)
   * @returns 조회된 게시판 (JSON으로 자동 변환)
   *
   * @Get(':id') 데코레이터:
   * - 경로 파라미터 ':id'를 정의합니다
   * - 예: GET /boards/1 → id = "1"
   *
   * @Param('id') 데코레이터:
   * - URL 파라미터에서 'id' 값을 추출합니다
   * - 문자열로 추출되므로 숫자로 변환(+id)이 필요합니다
   *
   * 라우트 순서 주의:
   * - @Get(':id')는 @Get()보다 뒤에 정의해야 합니다
   * - 그렇지 않으면 '/boards' 요청도 ':id'로 매칭될 수 있습니다
   */
  @Get(':id/posts')
  async searchPostsByBoard(@Param('id') id: string) {
    // 문자열을 숫자로 변환 (+id는 Number(id)와 동일)
    return await this.boardService.searchPostsByBoard(+id);
  }
}
