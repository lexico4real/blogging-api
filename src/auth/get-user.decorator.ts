import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const token = extractTokenFromRequest(req);

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    let decodedToken: { username: string };
    try {
      decodedToken = verifyToken(token);
      req.user = decodedToken;
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
    return req.user;
  },
);

function extractTokenFromRequest(req: any): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

function verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET);
}
