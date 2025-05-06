import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
    console.log('LocalStrategy inicializado');
  }

  async validate(email: string, senha: string) {
    try {
      console.log('Validando credenciais:', { email });
      const usuario = await this.authService.validarUsuario(email, senha);
      if (!usuario) {
        console.log('Usuário não encontrado');
        throw new UnauthorizedException();
      }
      console.log('Usuário validado com sucesso');
      return usuario;
    } catch (error) {
      console.error('Erro na validação:', error);
      throw error;
    }
  }
} 