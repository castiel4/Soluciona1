import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Proposal, ProposalStatus } from './proposal.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('proposal_history')
export class ProposalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proposal_id' })
  proposalId: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus
  })
  statusAnterior: ProposalStatus;

  @Column({
    type: 'enum',
    enum: ProposalStatus
  })
  statusNovo: ProposalStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  motivo: string;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @CreateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;

  @ManyToOne(() => Proposal)
  @JoinColumn({ name: 'proposal_id' })
  proposta: Proposal;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
} 