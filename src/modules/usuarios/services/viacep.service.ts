import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EnderecoDto } from '../dto/endereco.dto';

@Injectable()
export class ViaCepService {
  private readonly baseUrl = 'https://viacep.com.br/ws';

  constructor(private readonly httpService: HttpService) {}

  async buscarEnderecoPorCep(cep: string): Promise<Partial<EnderecoDto>> {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        throw new HttpException(
          'CEP inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${cepLimpo}/json`)
      );

      if (response.data.erro) {
        throw new HttpException(
          'CEP não encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      return {
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        estado: response.data.uf,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao consultar o CEP',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 