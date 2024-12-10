import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.servise';
import {
  LosginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async register(requset: RegisterUserRequest): Promise<UserResponse> {
    this.logger.log('info', `New User ${JSON.stringify(requset)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.RGISTER, requset);

    const totalUserWithSameName = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameName != 0) {
      throw new HttpException('User already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(requset: LosginUserRequest): Promise<UserResponse> {
    this.logger.log('info', `Login User ${JSON.stringify(requset)}`);
    const loginRequest: LosginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      requset,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('username or password is invalid', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }
}
