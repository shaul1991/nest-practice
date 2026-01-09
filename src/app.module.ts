import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [BoardModule, PostModule],
})
export class AppModule { }
