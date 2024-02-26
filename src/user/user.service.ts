import { HttpException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserAuthDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserAuthDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'status',
        'create_at',
        'update_at',
      ],
    });
  }
  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'status',
        'create_at',
        'update_at',
      ],
    });
  }
  async create(createUserAuthDto: CreateUserAuthDto): Promise<User> {
    const isCheckEmail = await this.userRepository.findOne({
      where: { email: createUserAuthDto.email },
    });
    if (isCheckEmail) {
      throw new HttpException('Email already exists', 400);
    }

    createUserAuthDto.password = await bcrypt.hash(
      createUserAuthDto.password,
      10,
    );
    return this.userRepository.save(createUserAuthDto);
  }
  async update(
    id: number,
    updateUserAuthDto: UpdateUserAuthDto,
  ): Promise<{ id: number }> {
    const { affected } = await this.userRepository.update(
      id,
      updateUserAuthDto,
    );
    if (affected === 0) {
      throw new HttpException('User not found', 404);
    }
    return { id };
  }
  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
