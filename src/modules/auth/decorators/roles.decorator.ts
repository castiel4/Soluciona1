import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from '../../usuarios/entities/usuario.entity';

export const Roles = (...roles: TipoUsuario[]) => SetMetadata('roles', roles); 