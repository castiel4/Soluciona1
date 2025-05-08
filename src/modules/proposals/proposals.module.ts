import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { Proposal } from './entities/proposal.entity';
import { ProposalHistory } from './entities/proposal-history.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal, ProposalHistory]),
    UsuariosModule,
    ServicesModule
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService]
})
export class ProposalsModule {} 