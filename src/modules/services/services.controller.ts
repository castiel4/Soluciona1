import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Service } from './entities/service.entity';
import { UploadService } from './services/upload.service';
import { CategoriaServico } from './enums/categorias.enum';
import { CreateServiceWithUser } from './interfaces/create-service-with-user.interface';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo serviço' })
  @ApiResponse({ status: 201, description: 'Serviço criado com sucesso', type: Service })
  @ApiResponse({ status: 403, description: 'Apenas prestadores podem cadastrar serviços' })
  async create(@Body() createServiceDto: CreateServiceDto, @Request() req): Promise<Service> {
    const serviceData: CreateServiceWithUser = {
      ...createServiceDto,
      usuarioId: req.user.id
    };
    return this.servicesService.create(serviceData);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de imagem para serviço' })
  @ApiResponse({ status: 201, description: 'Imagem enviada com sucesso' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar serviços' })
  @ApiQuery({ name: 'q', description: 'Termo de busca' })
  @ApiQuery({ name: 'categoria', enum: CategoriaServico, required: false })
  @ApiQuery({ name: 'minPreco', type: Number, required: false })
  @ApiQuery({ name: 'maxPreco', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Resultados da busca', type: [Service] })
  async search(
    @Query('q') query: string,
    @Query('categoria') categoria?: CategoriaServico,
    @Query('minPreco') minPreco?: number,
    @Query('maxPreco') maxPreco?: number,
  ): Promise<Service[]> {
    return this.servicesService.search(query, categoria, minPreco, maxPreco);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os serviços' })
  @ApiResponse({ status: 200, description: 'Lista de serviços', type: [Service] })
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar serviços por usuário' })
  @ApiResponse({ status: 200, description: 'Lista de serviços do usuário', type: [Service] })
  async findByUser(@Param('userId') userId: string): Promise<Service[]> {
    return this.servicesService.findByUserId(parseInt(userId));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar serviço' })
  @ApiResponse({ status: 200, description: 'Serviço atualizado com sucesso', type: Service })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar este serviço' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req,
  ): Promise<Service> {
    return this.servicesService.update(id, updateServiceDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover serviço' })
  @ApiResponse({ status: 200, description: 'Serviço removido com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para remover este serviço' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.servicesService.remove(id, req.user.id);
  }
} 