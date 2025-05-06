import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from './entities/usuario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ViaCepService } from './services/viacep.service';
import { EnderecoDto } from './dto/endereco.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly viaCepService: ViaCepService,
  ) {}

  @Post()
  async criar(@Body() createUserDto: CreateUserDto) {
    return this.usuariosService.criarUsuario(createUserDto);
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

  @Get('endereco/:cep')
  @ApiOperation({ summary: 'Busca endereço por CEP' })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado com sucesso',
    type: EnderecoDto
  })
  @ApiResponse({
    status: 400,
    description: 'CEP inválido'
  })
  @ApiResponse({
    status: 404,
    description: 'CEP não encontrado'
  })
  async buscarEnderecoPorCep(@Param('cep') cep: string): Promise<Partial<EnderecoDto>> {
    return this.viaCepService.buscarEnderecoPorCep(cep);
  }
} 