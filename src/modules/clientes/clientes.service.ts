import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async criarCliente(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      console.log('Tentando criar cliente com dados:', createClienteDto);
      const cliente = this.clientesRepository.create(createClienteDto);
      console.log('Cliente criado:', cliente);
      const resultado = await this.clientesRepository.save(cliente);
      console.log('Cliente salvo com sucesso:', resultado);
      return resultado;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    try {
      console.log('Buscando todos os clientes');
      const clientes = await this.clientesRepository.find();
      console.log('Clientes encontrados:', clientes);
      return clientes;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Cliente> {
    try {
      console.log('Buscando cliente com ID:', id);
      const cliente = await this.clientesRepository.findOne({ where: { id } });
      if (!cliente) {
        console.log('Cliente não encontrado');
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
      console.log('Cliente encontrado:', cliente);
      return cliente;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  async update(id: number, updateClienteDto: Partial<CreateClienteDto>): Promise<Cliente> {
    try {
      console.log('Atualizando cliente com ID:', id);
      const cliente = await this.findOne(id);
      Object.assign(cliente, updateClienteDto);
      const resultado = await this.clientesRepository.save(cliente);
      console.log('Cliente atualizado:', resultado);
      return resultado;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      console.log('Removendo cliente com ID:', id);
      const cliente = await this.findOne(id);
      await this.clientesRepository.remove(cliente);
      console.log('Cliente removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      throw error;
    }
  }
} 