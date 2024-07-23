import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Comment } from '@prisma/client';
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

  async getCommentsByPost(postId: string): Promise<CommentDto[]> {
    const comments: Comment[] = await this.prisma.comment.findMany({
      where: { postId },
      include: { author: true },
    });
    return comments.map(this.toCommentDto);
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
