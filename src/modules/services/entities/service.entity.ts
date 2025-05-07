import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CategoriaServico, SubcategoriaServico } from '../enums/categorias.enum';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({
    type: 'enum',
    enum: CategoriaServico,
    default: CategoriaServico.OUTROS
  })
  categoria: CategoriaServico;

  @Column({
    type: 'enum',
    enum: SubcategoriaServico,
    nullable: true
  })
  subcategoria: SubcategoriaServico;

  @Column('simple-array', { nullable: true })
  fotos: string[];

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Usuario, usuario => usuario.servicos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
} 