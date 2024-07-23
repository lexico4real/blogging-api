import { CommentsRepository } from './comments.repository';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(createCommentDto: CreateCommentDto) {
    return await this.commentsRepository.createComment(createCommentDto);
  }

  async getCommentsByPost(postId: string) {
    return await this.commentsRepository.getCommentsByPost(postId);
  }

  async deleteComment(commentId: string) {
    return await this.commentsRepository.deleteComment(commentId);
  }

  async findCommentById(id: string) {
    return await this.commentsRepository.findCommentById(id);
  }
}
