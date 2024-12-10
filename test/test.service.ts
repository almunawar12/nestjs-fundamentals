import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaservice: PrismaService) {}

  async deleteUser() {
    await this.prismaservice.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaservice.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('test', 10),
        name: 'test',
        token: 'test',
      },
    });
  }
}
