import { Inject, Injectable } from '@nestjs/common';
import { Post } from './Post.entity';
import { POST_REPOSITORY } from 'src/core/constants';
import { PostDto } from './dto/post.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  async create(post: PostDto, userId): Promise<Post> {
    return await this.postRepository.create<Post>({ ...post, userId });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      order: [['id', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async delete(id: number, userId: number) {
    return await this.postRepository.destroy({ where: { id, userId } });
  }

  async update(id: number, data: PostDto, userId: number) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.postRepository.update(
        { ...data },
        { where: { id, userId }, returning: true },
      );

    return { numberOfAffectedRows, updatedPost };
  }
}
