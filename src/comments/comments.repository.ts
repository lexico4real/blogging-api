import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Comment, Prisma } from '@prisma/client';
import { CommentDto, CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, postId, authorId } = createCommentDto;
    try {
      return await this.prisma.comment.create({
        data: {
          content,
          postId,
          authorId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async getCommentsByPost(params: {
    postId: string;
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<{
    comments: CommentDto[];
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
      const { postId, skip, take, cursor, where, orderBy } = params;

      const comments = await this.prisma.comment.findMany({
        where: { postId, ...where },
        skip,
        take,
        cursor,
        orderBy,
        include: { author: true },
      });

      const totalCount = await this.prisma.comment.count({
        where: { postId, ...where },
      });

      const totalPages = Math.ceil(totalCount / take);
      const currentPage = Math.floor(skip / take) + 1;
      const nextPage = skip + take < totalCount ? currentPage + 1 : null;
      const prevPage = skip > 0 ? currentPage - 1 : null;

      return {
        comments: comments.map(this.toCommentDto),
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
      throw new InternalServerErrorException('Failed to retrieve comments');
    }
  }

  async deleteComment(commentId: string): Promise<CommentDto> {
    await this.findCommentById(commentId);
    try {
      const comment: Comment = await this.prisma.comment.delete({
        where: { id: commentId },
      });
      return this.toCommentDto(comment);
    } catch (error) {
      throw error;
    }
  }

  async findCommentById(id: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException(`Comment with ID "${id}" not found`);
      }
      return comment;
    } catch (error) {
      if (error?.message === `Comment with ID "${id}" not found`) {
        throw new NotFoundException(`Comment with ID "${id}" not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve comment');
    }
  }

  private toCommentDto(comment: Comment): CommentDto {
    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }
}
