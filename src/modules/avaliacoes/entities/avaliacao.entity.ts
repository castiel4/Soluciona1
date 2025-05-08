import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  nota: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @Column({ name: 'cliente_id' })
  clienteId: string;

  @Column({ name: 'prestador_id' })
  prestadorId: string;

  @Column({ name: 'servico_id' })
  servicoId: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

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