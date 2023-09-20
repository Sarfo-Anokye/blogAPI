import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request, ConsoleLogger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { PostDto } from './dto/post.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-ayth.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Get()
    async findAll() {
        return await this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postService.findOne(id);

        if (!post) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return post;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
        return await this.postService.create(post, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() post: PostDto, @Request() req): Promise<PostEntity> {
        const { numberOfAffectedRows, updatedPost } = await this.postService.update(id, post, req.user.id);

        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return updatedPost;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        const deleted = await this.postService.delete(id, req.user.id);

        if (deleted === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return 'Successfully deleted';
    }
}