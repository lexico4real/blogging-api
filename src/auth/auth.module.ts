import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as config from 'config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from './users.repository';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          process.env.JWT_SECRET ||
          configService.get('JWT_SECRET') ||
          jwtConfig['secret'],
        signOptions: {
          expiresIn:
            process.env.JWT_EXPIRES_IN ||
            configService.get('JWT_EXPIRES_IN') ||
            jwtConfig['expiresIn'] ||
            '10h',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, UsersRepository],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
