import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, TipoUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  // Array com todos os DDDs válidos do Brasil
  private dddsValidos = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // São Paulo
    21, 22, 24, 27, 28, // Rio de Janeiro e Espírito Santo
    31, 32, 33, 34, 35, 37, 38, // Minas Gerais
    41, 42, 43, 44, 45, 46, 47, 48, 49, // Paraná e Santa Catarina
    51, 53, 54, 55, // Rio Grande do Sul
    61, 62, 63, 64, 65, 66, 67, 68, 69, // Centro-Oeste
    71, 73, 74, 75, 77, 79, // Bahia e Sergipe
    81, 82, 83, 84, 85, 86, 87, 88, 89, // Nordeste
    91, 92, 93, 94, 95, 96, 97, 98, 99 // Norte
  ];

  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  private formatarTelefone(telefone: string): string {
    // Remove todos os caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');
    
    // Verifica se o número tem a quantidade correta de dígitos
    if (numeros.length < 10 || numeros.length > 11) {
      throw new BadRequestException('Número de telefone deve ter 10 ou 11 dígitos');
    }

    // Extrai e valida o DDD
    const ddd = parseInt(numeros.slice(0, 2));
    if (!this.dddsValidos.includes(ddd)) {
      throw new BadRequestException(`DDD ${ddd} não é válido no Brasil`);
    }

    // Extrai o número
    const numero = numeros.length === 11 
      ? `${numeros.slice(2, 7)}-${numeros.slice(7)}` // Celular
      : `${numeros.slice(2, 6)}-${numeros.slice(6)}`; // Fixo

    return `(${ddd}) ${numero}`;
  }

  async criarUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verifica se já existe um usuário com o mesmo email
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { email: createUsuarioDto.email }
    });

    if (usuarioExistente) {
      throw new ConflictException('Já existe um usuário cadastrado com este email');
    }

    const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha, 10);
    
    // Formata o telefone se fornecido
    if (createUsuarioDto.telefone) {
      try {
        createUsuarioDto.telefone = this.formatarTelefone(createUsuarioDto.telefone);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
    
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      senha: senhaCriptografada,
    });
    
    return this.usuariosRepository.save(usuario);
  }

  async encontrarPorEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }
    return usuario;
  }

  async encontrarPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  async atualizarUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.encontrarPorId(id);
    
    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    // Formata o telefone se fornecido
    if (updateUsuarioDto.telefone) {
      try {
        updateUsuarioDto.telefone = this.formatarTelefone(updateUsuarioDto.telefone);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
    
    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async listarPorTipo(tipo: TipoUsuario): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: { tipo },
      select: ['id', 'nome', 'email', 'tipo', 'fotoPerfil', 'telefone', 'endereco', 'biografia']
    });
  }
} 