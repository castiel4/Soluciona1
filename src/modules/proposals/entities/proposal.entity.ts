import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Service } from '../../services/entities/service.entity';

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorProposto: number;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING
  })
  status: ProposalStatus;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @Column({ name: 'data_expiracao' })
  dataExpiracao: Date;

  @Column({ name: 'cliente_id' })
  clienteId: string;

  @Column({ name: 'prestador_id' })
  prestadorId: string;

  @Column({ name: 'servico_id' })
  servicoId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'prestador_id' })
  prestador: Usuario;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'servico_id' })
  servico: Service;
} 