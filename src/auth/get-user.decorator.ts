import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client'; // Update import to use Prisma's User type

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
