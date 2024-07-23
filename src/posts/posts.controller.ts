import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'common/roles.enum';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard())
  createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.createPost({
      ...createPostDto,
      authorId: user.id,
    });
  }

  @Get()
  findAllPosts(@Query() query: any) {
    const { skip, take, cursor, where, orderBy } = query;
    return this.postsService.findAllPosts({
      skip: Number(skip) || 0,
      take: Number(take) || 10,
      cursor: cursor ? JSON.parse(cursor) : undefined,
      where: where ? JSON.parse(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    });
  }

  @Get(':id')
  findPostById(@Param('id') id: string) {
    return this.postsService.findPostById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    const post = await this.postsService.findPostById(id);
    if (post.authorId !== user.id) {
      throw new UnauthorizedException('You can only edit your own posts');
    }
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Roles(Role.Super_Admin, Role.Admin)
  @Delete(':id')
  deletePost(@Param('postId') postId: string) {
    return this.postsService.deletePost(postId);
  }
}
