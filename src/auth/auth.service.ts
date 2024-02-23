import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    console.log(registerAuthDto);

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
    console.log(user);

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.generateToken({ id: user.id, email: user.email });
  }
  private async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: '123123123',
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
