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
import { JwtGuard } from 'modules/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Tạo tài khoản mới (Admin only)' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userService.createUser(createUserDto, req);
  }

  @ApiOperation({ summary: 'Lấy danh sách người dùng (Admin only)' })
  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findAll(@Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  @Get('me')
  @UseGuards(JwtGuard)
  findMe(@Request() req) {
    return this.userService.getUserProfile(req.user.id);
  }

  @ApiOperation({ summary: 'Xem thông tin tài khoản (Admin only)' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findOneByAdmin(@Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.getUserByAdmin(req.params.id);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @Patch()
  @UseGuards(JwtGuard)
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản (Admin only)' })
  @Patch(':id')
  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Khóa tài khoản (Admin only)' })
  @Delete('block/:id')
  block(@Param('id') id: number, @Request() req) {
    return this.userService.blockUser(id, req);
  }

  @ApiOperation({ summary: 'Mở khóa tài khoản (Admin only)' })
  @Patch('activate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  active(@Param('id') id: number, @Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.activateUser(id);
  }

  @ApiOperation({ summary: 'Xóa tài khoản (Admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    if (req.user.role !== '3108') {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return this.userService.deleteUser(id);
  }
}
