import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userService.createUser(createUserDto, req);
  }

  @Get('all')
  @UseGuards(JwtGuard)
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get('me')
  @UseGuards(JwtGuard)
  findMe(@Request() req) {
    return this.userService.getUserProfile(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOneByAdmin(@Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.getUserByAdmin(req.params.id);
  }

  @Patch()
  @UseGuards(JwtGuard)
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateByAdmin(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('block/:id')
  @UseGuards(JwtGuard)
  block(@Param('id') id: number, @Request() req) {
    return this.userService.blockUser(id, req);
  }

  @Post('activate/:id')
  @UseGuards(JwtGuard)
  active(@Param('id') id: number, @Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.activateUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: number, @Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.deleteUser(id);
  }
}
