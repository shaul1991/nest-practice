import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

/**
 * Controller: PostController (게시글 HTTP 요청 처리)
 *
 * 게시글 관련 HTTP 요청을 처리하는 컨트롤러입니다.
 * - RESTful API를 제공합니다
 * - 쿼리 파라미터를 사용한 필터링을 지원합니다
 */
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 게시글 생성
   * Route: POST /posts
   *
   * @param createPostDto - 게시글 생성 데이터 (boardId, title, content)
   * @returns 생성된 게시글
   */
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  /**
   * 게시글 목록 조회
   * Route: GET /posts 또는 GET /posts?boardId=1
   *
   * @param boardId - 쿼리 파라미터: 특정 게시판의 게시글만 조회 (선택적)
   * @returns 게시글 배열
   *
   * @Query('boardId') 데코레이터:
   * - URL 쿼리 파라미터에서 'boardId' 값을 추출합니다
   * - 예: GET /posts?boardId=1 → boardId = "1"
   * - 문자열로 추출되므로 숫자로 변환(+boardId)이 필요합니다
   *
   * 사용 예시:
   * - GET /posts → 모든 게시글 조회
   * - GET /posts?boardId=1 → 게시판 1의 게시글만 조회
   */
  @Get()
  async findAll(@Query('boardId') boardId?: string) {
    // 쿼리 파라미터가 있으면 숫자로 변환, 없으면 undefined
    const boardIdNumber = boardId ? +boardId : undefined;
    return await this.postService.findAll(boardIdNumber);
  }

  /**
   * 특정 게시글 조회
   * Route: GET /posts/:id
   *
   * @param id - URL 파라미터에서 추출된 게시글 ID
   * @returns 조회된 게시글
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(+id);
  }

  /**
   * 게시글 수정
   * Route: PUT /posts/:id
   *
   * @param id - URL 파라미터에서 추출된 게시글 ID
   * @param updatePostDto - 수정할 정보 (title, content - 선택적)
   * @returns 수정된 게시글
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postService.update(+id, updatePostDto);
  }

  /**
   * 게시글 삭제
   * Route: DELETE /posts/:id
   *
   * @param id - URL 파라미터에서 추출된 게시글 ID
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postService.remove(+id);
  }
}
