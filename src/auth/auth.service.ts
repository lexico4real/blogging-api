import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id, username };
      const accessToken: string = await this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const decodedToken = this.jwtService.decode(accessToken) as any;
      console.log('Decoded JWT:', decodedToken);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async validateUser(username: string): Promise<any | null> {
    return this.usersRepository.findOneByUsername(username);
  }

  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

  verifyJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
