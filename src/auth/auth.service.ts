import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    // console.log(registerAuthDto);
    const user = await this.userRepository.findOne({
      where: { email: registerAuthDto.email },
    });
    if (user) {
      throw new HttpException('Email already exists', 400);
    }
    return await this.userRepository.save({
      ...registerAuthDto,
      password: await this.hashPassword(registerAuthDto.password),
    });
  }
  async login(loginAuthDto: LoginAuthDto): Promise<any> {
    console.log(loginAuthDto.email);

    const user = await this.userRepository.findOne({
      where: { email: loginAuthDto.email },
    });
    if (!user) {
      throw new HttpException('User not found', 401);
    }
    // console.log(user);
    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.generateToken({ id: user.id, email: user.email });
  }
  async refreshtoken(refresh_token: string): Promise<any> {
    try {
      // console.log('payload', refresh_token);
      const payload = await this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      const checkIsToken = await this.userRepository.findOne({
        where: { email: payload.email },
      });
      if (!checkIsToken) {
        throw new HttpException('User not found', 401);
      }
      return this.generateToken({ id: payload.id, email: payload.email });
    } catch (error) {
      throw new HttpException('Invalid refresh token', 401);
    }
  }
  private async generateToken(payload: { id: number; email: string }) {
    // console.log('access_token', process.env.JWT_SECRET);
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('EXP_IN_ACCESSTOKEN'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('EXP_IN_REFRESHTOKEN'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    await this.userRepository.update(
      { id: payload.id },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
