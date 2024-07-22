import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import Logger from 'config/log4js/logger';
import { Role } from 'common/roles.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const request = await context.switchToHttp().getRequest();
      const bearerToken = this.getBearerToken(request?.rawHeaders);
      if (!bearerToken) {
        throw new NotFoundException('Unauthorized, token absent in header.');
      }
      const { username, roles } = this.authService.verifyJwt(bearerToken);
      const result = requiredRoles.some((role) => roles?.includes(role));
      new Logger().log(
        'info',
        'info',
        `${username} attempting ${request?.url}. \nRequired role(s): ${requiredRoles}, \nAvailable role(s): ${roles}. \nisSuccessful: ${result}`,
        'roles-guard-trace',
      );
      return result;
    } catch (error) {
      new Logger().log('error', 'error', error, 'roles-guard-error');
      if (
        error?.message === 'Unauthorized, token absent in header.' ||
        error?.message === 'No user found'
      ) {
        throw new BadRequestException('You are not logged in.');
      }
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Expired login token');
      }
      if (error?.name === 'JsonWebTokenError') {
        throw new BadRequestException('Expired login token');
      }
      throw new InternalServerErrorException(
        'Something went wrong. Please contact the admin',
      );
    }
  }

  getBearerToken(rawHeaders: string[]) {
    if (Array.isArray(rawHeaders)) {
      for (const item of rawHeaders) {
        if (item.includes('Bearer')) {
          const token = item.split(' ')[1]?.trim();
          if (token) {
            return token;
          }
        }
      }
    }
    return null;
  }
}
