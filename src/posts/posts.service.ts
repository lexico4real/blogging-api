import { PostsRepository } from './posts.repository';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async createPost(createPostDto: CreatePostDto) {
    return await this.postsRepository.createPost(createPostDto);
  }

  async findAllPosts() {
    return await this.postsRepository.findAllPosts();
  }

  async findPostById(id: string) {
    return await this.postsRepository.findPostById(id);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return await this.postsRepository.updatePost(id, updatePostDto);
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsRepository.deletePost(postId);
  }
}
