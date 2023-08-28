import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postProviders } from './post.provider';

@Module({
  providers: [PostsService,...postProviders],
  controllers: [PostsController]
})
export class PostsModule {}
