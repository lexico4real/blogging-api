import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsOptional()
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
