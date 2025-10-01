import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, IsNull, Not } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { GenericRepository } from 'src/repositories/genericRepository';

@Injectable()
export class UserService {
  private readonly userRepository: GenericRepository<User>;
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    manager: EntityManager,
  ) {
    this.userRepository = new GenericRepository(User, manager);
  }

  async getUserProfile(id: number) {
    return await this.userRepository.findById(id, [
      'email',
      'fullname',
      'phone',
      'id',
      'emailVerified',
      'phoneVerified',
      'createdAt',
    ]);
  }

  async getAllUsers() {
    return await this.userRepository.find({
      select: [
        'email',
        'fullname',
        'phone',
        'id',
        'emailVerified',
        'phoneVerified',
        'createdAt',
      ],
    });
  }

  async createUser(userData: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) throw new BadRequestException('Email đã được sử dụng');
    return await this.userRepository.create(userData);
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    const safeData: UpdateUserDto = { ...userData };
    if (user.emailVerified && 'email' in safeData) {
      delete safeData.email;
      throw new BadRequestException('Email đã xác minh');
    }
    if (user.phoneVerified && 'phone' in safeData) {
      delete safeData.phone;
      throw new BadRequestException('Số điện thoại đã xác minh');
    }
    return await this.userRepository.update(id, safeData);
  }

  async deleteUser(id: number) {
    await this.userRepository.delete(id, 'Tài khoản không tồn tại');
  }

  async blockUser(id: number) {
    await this.userRepository.softDelete(id, 'Tài khoản không tồn tại');
    return { message: 'Đã khóa tài khoản' };
  }

  async activateUser(id: number) {
    const user = await this.userRepository.getRepository().findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    await this.userRepository.getRepository().restore(id);
    return { message: 'Đã mở khóa tài khoản' };
  }
}
