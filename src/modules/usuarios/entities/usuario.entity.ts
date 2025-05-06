import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoUsuario {
  PRESTADOR = 'prestador',
  SOLICITANTE = 'solicitante'
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  senha: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.SOLICITANTE
  })
  tipo: TipoUsuario;

  @Column({ length: 255, nullable: true, name: 'foto_perfil' })
  fotoPerfil: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ length: 255, nullable: true })
  endereco: string;

  @Column({ type: 'text', nullable: true })
  biografia: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'avaliacao_media' })
  avaliacaoMedia: number;

  @Column({ type: 'int', default: 0, name: 'total_avaliacoes' })
  totalAvaliacoes: number;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao: Date;
} 