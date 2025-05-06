import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {
    console.log('AuthService inicializado');
  }

  async validarUsuario(email: string, senha: string) {
    try {
      console.log('Tentando validar usuário:', email);
      const usuario = await this.usuariosService.encontrarPorEmail(email);
      console.log('Usuário encontrado:', usuario);
      
      if (!usuario) {
        console.log('Usuário não encontrado');
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      console.log('Comparando senhas...');
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      console.log('Senha válida:', senhaValida);
      
      if (!senhaValida) {
        console.log('Senha inválida');
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      const { senha: _, ...resultado } = usuario;
      return resultado;
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      throw error;
    }
  }

  async login(usuario: any) {
    try {
      console.log('Gerando token JWT para usuário:', usuario);
      const payload = { 
        sub: usuario.id,
        email: usuario.email,
      };
      const token = this.jwtService.sign(payload);
      console.log('Token gerado com sucesso');
      return {
        access_token: token,
      };
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      throw error;
    }
  }
} 