import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'common/roles.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '@prisma/client';

@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.createPost({
      ...createPostDto,
      authorId: user.id,
    });
  }

  @Get()
  findAllPosts() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  findPostById(@Param('id') id: string) {
    return this.postsService.findPostById(id);
  }

  @Patch(':id')
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
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
