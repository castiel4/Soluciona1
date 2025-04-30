import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@core/entities/user.entity';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    this.users.push(user);
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = this.users.find(u => u.email === loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      type: user.type,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 