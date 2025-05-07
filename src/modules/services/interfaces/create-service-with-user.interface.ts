import { CreateServiceDto } from '../dto/create-service.dto';

export interface CreateServiceWithUser extends CreateServiceDto {
    usuarioId: number;
} 