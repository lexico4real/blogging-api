import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content, authorId } = createPostDto;
    try {
      return await this.prisma.post.create({
        data: {
          id: uuidv4(),
          title,
          content,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async findAllPosts(): Promise<Post[]> {
    try {
      return await this.prisma.post.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve posts');
    }
  }

  async findPostById(id: string): Promise<Post> {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });
      if (!post) {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }
      return post;
    } catch (error) {
      if (error?.message === '`Post with ID "${id}" not found`') {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve post');
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    await this.findPostById(id);
    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async deletePost(postId: string): Promise<void> {
    await this.findPostById(postId);
    try {
      await this.prisma.post.delete({
        where: { id: postId },
      });
    } catch (error) {
      throw error;
    }
  }
}
