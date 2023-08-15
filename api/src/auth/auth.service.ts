import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const isPasswordCorrect = await bcrypt.compare(pass, user.password);

    return isPasswordCorrect ? user : null;
  }

  async validateUserExist(username: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    return user ? user : null;
  }

  async validateRefreshToken(uuid: string): Promise<any> {
    const existToken = await this.prisma.blackListToken.findFirst({
      where: { uuid },
    });

    return !existToken;
  }

  async refresh(at: string, payload: RefreshTokenPayload): Promise<any> {
    const isAccessTokenVerified: AccessTokenPayload | undefined =
      this.jwtService.verify(at, {
        ignoreExpiration: true,
        secret: process.env.JWT_SECRET_KEY,
      });
    if (!isAccessTokenVerified || isAccessTokenVerified.id !== payload.id)
      throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({
      where: {
        id: isAccessTokenVerified.id,
        email: isAccessTokenVerified.email,
      },
    });

    if (!user) throw new UnauthorizedException();

    return {
      access_token: this.jwtService.sign({
        id: isAccessTokenVerified.id,
        email: isAccessTokenVerified.email,
      }),
      refresh_token: this.jwtService.sign(
        {
          id: payload.id,
          uuid: randomUUID(),
        },
        { secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '2d' },
      ),
    };
  }

  async login(user: User) {
    const payload: Partial<AccessTokenPayload> = {
      email: user.email,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { ...payload, uuid: randomUUID() },
        { secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '2d' },
      ),
    };
  }
}
