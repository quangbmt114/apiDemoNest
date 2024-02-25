import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/auth.guard';
import { CreateUserAuthDto } from './dto/create-user.dto';
import { UpdateUserAuthDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post('create')
  create(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.userService.create(createUserAuthDto);
  }
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Put('update/:id')
  update(
    @Param('id') id: number,
    @Body() updateUserAuthDto: UpdateUserAuthDto,
  ) {
    return this.userService.update(id, updateUserAuthDto);
  }
}
