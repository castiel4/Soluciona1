import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    console.log('AuthController inicializado');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: { email: string; senha: string }) {
    try {
      console.log('Tentando fazer login:', loginDto);
      const usuario = await this.authService.validarUsuario(
        loginDto.email,
        loginDto.senha,
      );
      console.log('Usuário validado:', usuario);
      const token = await this.authService.login(usuario);
      console.log('Login realizado com sucesso');
      return token;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }
} 