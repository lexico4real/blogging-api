import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, User } from '@prisma/client';
import { Role } from 'common/roles.enum';
import Logger from 'config/log4js/logger';

@Injectable()
export class UsersRepository {
  logger: Logger = new Logger();
  constructor(private readonly prisma: PrismaService) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultRoles = [Role.User];
    const roles = authCredentialsDto.roles || defaultRoles;

    try {
      await this.prisma.user.create({
        data: {
          id: uuidv4(),
          username,
          password: hashedPassword,
          roles,
        },
      });
    } catch (error) {
      this.logger.log(
        'info',
        'info',
        error,
        'create-user',
      );
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async getAllUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{
    users: any[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
      nextPage: number | null;
      prevPage: number | null;
    };
  }> {
    try {
      const { skip, take, cursor, where, orderBy } = params;

      const users = await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        select: {
          id: true,
          username: true,
          name: true,
          roles: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const totalCount = await this.prisma.user.count({
        where,
      });

      const totalPages = Math.ceil(totalCount / take);
      const currentPage = Math.floor(skip / take) + 1;
      const nextPage = currentPage < totalPages ? currentPage + 1 : null;
      const prevPage = currentPage > 1 ? currentPage - 1 : null;

      return {
        users: users as any,
        pagination: {
          totalItems: totalCount,
          totalPages,
          currentPage,
          itemsPerPage: take,
          nextPage,
          prevPage,
        },
      };
    } catch (error) {
      this.logger.log('info', 'info', error, 'fetch-users');
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }
}
