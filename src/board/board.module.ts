import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';

/**
 * Module: BoardModule (게시판 모듈)
 *
 * Module은 NestJS의 기본 구성 단위입니다.
 * - 관련된 Controller, Service, Provider 등을 그룹화합니다
 * - 의존성 주입(DI) 컨테이너를 구성합니다
 * - 모듈 간 의존성을 관리합니다
 *
 * @Module() 데코레이터의 역할:
 * 1. 이 클래스를 NestJS 모듈로 등록합니다
 * 2. 모듈의 메타데이터를 정의합니다 (controllers, providers, exports 등)
 *
 * 왜 Module을 사용하나요?
 * 1. 모듈화: 관련 기능을 하나로 묶어 관리합니다
 * 2. 캡슐화: 모듈 내부 구현을 숨기고 인터페이스만 노출합니다
 * 3. 재사용성: 다른 모듈에서 이 모듈을 import하여 사용할 수 있습니다
 * 4. 테스트: 모듈 단위로 테스트할 수 있습니다
 * 5. 의존성 관리: 모듈 간 의존성을 명확히 합니다
 */
@Module({
    /**
     * controllers: 이 모듈에 속한 Controller 목록
     *
     * Controller는 HTTP 요청을 처리합니다.
     * - BoardController가 이 모듈에 등록됩니다
     * - NestJS가 자동으로 라우팅을 설정합니다
     */
    controllers: [BoardController],

    /**
     * providers: 이 모듈에 속한 Provider 목록
     *
     * Provider는 의존성 주입 시스템에 등록되는 클래스입니다.
     * - BoardService가 이 모듈의 Provider로 등록됩니다
     * - 같은 모듈 내의 Controller나 다른 Provider에서 주입받을 수 있습니다
     * - @Injectable() 데코레이터가 있는 클래스가 Provider가 됩니다
     */
    providers: [BoardService],

    /**
     * exports: 다른 모듈에서 사용할 수 있도록 내보내는 Provider 목록
     *
     * BoardService를 export하는 이유:
     * - PostModule에서 BoardService를 사용해야 합니다
     * - PostService가 BoardService에 의존하기 때문입니다
     * - export하지 않으면 다른 모듈에서 사용할 수 없습니다
     *
     * 모듈 간 의존성:
     * - PostModule에서 BoardModule을 import하면
     * - PostModule의 Provider들이 BoardService를 주입받을 수 있습니다
     */
    exports: [BoardService],
})
export class BoardModule { }
