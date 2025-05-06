import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, TipoUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async criarUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verifica se já existe um usuário com o mesmo email
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { email: createUsuarioDto.email }
    });

    if (usuarioExistente) {
      throw new ConflictException('Já existe um usuário cadastrado com este email');
    }

    const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha, 10);
    
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
    
    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async listarPorTipo(tipo: TipoUsuario): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: { tipo },
      select: ['id', 'nome', 'email', 'tipo', 'fotoPerfil', 'telefone', 'endereco', 'biografia', 'avaliacaoMedia', 'totalAvaliacoes']
    });
  }

  async atualizarAvaliacao(id: number, novaAvaliacao: number): Promise<Usuario> {
    const usuario = await this.encontrarPorId(id);
    
    const totalAvaliacoes = usuario.totalAvaliacoes + 1;
    const avaliacaoMedia = ((usuario.avaliacaoMedia * usuario.totalAvaliacoes) + novaAvaliacao) / totalAvaliacoes;
    
    usuario.avaliacaoMedia = avaliacaoMedia;
    usuario.totalAvaliacoes = totalAvaliacoes;
    
    return this.usuariosRepository.save(usuario);
  }
} 