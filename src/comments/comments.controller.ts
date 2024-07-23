import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto, CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'common/roles.enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard())
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<CreateCommentDto> {
    return this.commentsService.createComment({
      ...createCommentDto,
      authorId: user.id,
    });
  }

  @Get(':id')
  findCommentById(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }

  @Get('post/:postId')
  getCommentsByPost(@Param('postId') postId: string): Promise<CommentDto[]> {
    return this.commentsService.getCommentsByPost(postId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @Roles(Role.Super_Admin, Role.Admin)
  deleteComment(@Param('id') id: string): Promise<CommentDto> {
    return this.commentsService.deleteComment(id);
  }
}
