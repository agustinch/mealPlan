import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(user: CreateUserDto) {
    const { password, ...userWithoutPass } = user;
    return this.prisma.user.create({
      data: {
        ...userWithoutPass,
        password: this.jwtService.sign(password, {
          secret: process.env.PASS_SECRET_KEY,
        }),
      },
    });
  }
  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
