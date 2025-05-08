import { TipoUsuario } from '../entities/usuario.entity';

/**
 * Normaliza o tipo de usuário para garantir consistência no banco de dados
 * @param tipo - O tipo de usuário a ser normalizado
 * @returns O tipo normalizado ('PRESTADOR' ou 'SOLICITANTE')
 */
export function normalizeTipoUsuario(tipo: string): TipoUsuario {
  // Converte para maiúsculas
  let normalized = tipo.toUpperCase();
  
  // Remove acentos
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Remove espaços e símbolos especiais
  normalized = normalized.replace(/[^A-Z]/g, '');
  
  // Remove plural simples (es, s)
  normalized = normalized.replace(/ES$|S$/, '');
  
  // Garante que o valor final seja um dos tipos válidos
  if (normalized === 'PRESTADOR') {
    return TipoUsuario.PRESTADOR;
  } else if (normalized === 'SOLICITANTE') {
    return TipoUsuario.SOLICITANTE;
  }
  
  // Se não conseguir normalizar para um valor válido, lança erro
  throw new Error('Tipo de usuário inválido. Use "prestador" ou "solicitante".');
}

/**
 * Formata o tipo de usuário para exibição no frontend
 * @param tipo - O tipo de usuário do banco
 * @returns O tipo formatado para exibição ("Prestador" ou "Solicitante")
 */
export function formatTipoUsuarioForDisplay(tipo: TipoUsuario): string {
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
} 