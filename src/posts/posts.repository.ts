import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Post, Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDto } from './dto/update-post.dto';
import Logger from 'config/log4js/logger';

@Injectable()
export class PostsRepository {
  logger: Logger = new Logger();
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
      this.logger.log('info', 'info', error, 'create-post');
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async findAllPosts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<{
    posts: Post[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
      nextPage: number | null;
      prevPage: number | null;
    };
  }> {
    try {
      const { skip, take, cursor, where, orderBy } = params;

      const posts = await this.prisma.post.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });

      const totalCount = await this.prisma.post.count({
        where,
      });

      const totalPages = Math.ceil(totalCount / take);
      const currentPage = Math.floor(skip / take) + 1;
      const nextPage = skip + take < totalCount ? currentPage + 1 : null;
      const prevPage = skip > 0 ? currentPage - 1 : null;

      return {
        posts,
        pagination: {
          totalItems: totalCount,
          totalPages,
          currentPage,
          itemsPerPage: take,
          nextPage,
          prevPage,
        },
      };
    } catch (error) {
      this.logger.log('info', 'info', error, 'fetch-post');
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
      this.logger.log('info', 'info', error, 'fetch-post-by-id');
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
      this.logger.log('info', 'info', error, 'delete-post');
      throw error;
    }
  }
}
