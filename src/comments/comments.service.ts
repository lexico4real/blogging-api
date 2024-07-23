import { CommentsRepository } from './comments.repository';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(createCommentDto: CreateCommentDto) {
    return await this.commentsRepository.createComment(createCommentDto);
  }

  async getCommentsByPost(params: {
    postId: string;
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }) {
    return this.commentsRepository.getCommentsByPost(params);
  }

  async deleteComment(commentId: string) {
    return await this.commentsRepository.deleteComment(commentId);
  }

  async findCommentById(id: string) {
    return await this.commentsRepository.findCommentById(id);
  }
}
