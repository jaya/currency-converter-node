import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    try {
      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
