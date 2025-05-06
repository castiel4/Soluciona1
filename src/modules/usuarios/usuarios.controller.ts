import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from './entities/usuario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async criar(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.criarUsuario(createUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async encontrarUm(@Param('id') id: string) {
    return this.usuariosService.encontrarPorId(parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  async encontrarPorEmail(@Param('email') email: string) {
    return this.usuariosService.encontrarPorEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ) {
    return this.usuariosService.atualizarUsuario(parseInt(id), updateUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tipo/:tipo')
  async listarPorTipo(@Param('tipo') tipo: TipoUsuario) {
    return this.usuariosService.listarPorTipo(tipo);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/avaliacao')
  async atualizarAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number
  ) {
    return this.usuariosService.atualizarAvaliacao(parseInt(id), avaliacao);
  }
} 