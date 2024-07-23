import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}

export class CommentDto {
  @IsUUID()
  id: string;

  @IsString()
  content: string;

  @IsString()
  postId: string;

  @IsString()
  authorId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
