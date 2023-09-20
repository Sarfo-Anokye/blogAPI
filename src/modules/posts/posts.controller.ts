import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-ayth.guard';
import { PostDto } from './dto/post.dto';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll() {
    try {
      return await this.postService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostEntity> {
    try {
      const post = await this.postService.findOne(id);

      if (!post) {
        throw new NotFoundException("This Post doesn't exist");
      }
      return post;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
    try {
      return await this.postService.create(post, req.user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() post: PostDto,
    @Request() req,
  ): Promise<PostEntity> {
    try {
      const { numberOfAffectedRows, updatedPost } =
        await this.postService.update(id, post, req.user.id);

      if (numberOfAffectedRows === 0) {
        throw new NotFoundException("This Post doesn't exist");
      }

      return updatedPost;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    try {
      const deleted = await this.postService.delete(id, req.user.id);

      if (deleted === 0) {
        throw new NotFoundException("This Post doesn't exist");
      }

      return 'Successfully deleted';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
