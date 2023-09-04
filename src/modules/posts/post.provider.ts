import { POST_REPOSITORY } from 'src/core/constants';
import { Post } from './Post.entity';
export const postProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
];
