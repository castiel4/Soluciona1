import { CategoriaServico, SubcategoriaServico } from '../enums/categorias.enum';

export function normalizeCategoria(categoria: string): CategoriaServico {
  const categoriaNormalizada = categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  const categoriasMap = {
    'manutencao': CategoriaServico.MANUTENCAO,
    'construcao': CategoriaServico.CONSTRUCAO,
    'limpeza': CategoriaServico.LIMPEZA,
    'tecnologia': CategoriaServico.TECNOLOGIA,
    'saude': CategoriaServico.SAUDE,
    'educacao': CategoriaServico.EDUCACAO,
    'beleza': CategoriaServico.BELEZA,
    'transporte': CategoriaServico.TRANSPORTE,
    'alimentacao': CategoriaServico.ALIMENTACAO,
    'outros': CategoriaServico.OUTROS
  };

  const categoriaEncontrada = categoriasMap[categoriaNormalizada];
  if (!categoriaEncontrada) {
    throw new Error('Categoria inválida');
  }

  return categoriaEncontrada;
}

export function normalizeSubcategoria(subcategoria: string): SubcategoriaServico {
  const subcategoriaNormalizada = subcategoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  const subcategoriasMap = {
    // Manutenção
    'eletrica': SubcategoriaServico.ELETRICA,
    'hidraulica': SubcategoriaServico.HIDRAULICA,
    'arcondicionado': SubcategoriaServico.AR_CONDICIONADO,
    'pintura': SubcategoriaServico.PINTURA,
    'jardinagem': SubcategoriaServico.JARDINAGEM,

    // Construção
    'reforma': SubcategoriaServico.REFORMA,
    'alvenaria': SubcategoriaServico.ALVENARIA,
    'acabamento': SubcategoriaServico.ACABAMENTO,
    'decoracao': SubcategoriaServico.DECORACAO,

    // Limpeza
    'domestica': SubcategoriaServico.DOMESTICA,
    'comercial': SubcategoriaServico.COMERCIAL,
    'posobra': SubcategoriaServico.POS_OBRA,

    // Tecnologia
    'informatica': SubcategoriaServico.INFORMATICA,
    'redes': SubcategoriaServico.REDES,
    'celulares': SubcategoriaServico.CELULARES,

    // Saúde
    'massagem': SubcategoriaServico.MASSAGEM,
    'fisioterapia': SubcategoriaServico.FISIOTERAPIA,
    'nutricao': SubcategoriaServico.NUTRICAO,

    // Educação
    'aulaspaticulares': SubcategoriaServico.AULAS_PARTICULARES,
    'idiomas': SubcategoriaServico.IDIOMAS,
    'musica': SubcategoriaServico.MUSICA,

    // Beleza
    'cabeleireiro': SubcategoriaServico.CABELEIREIRO,
    'manicure': SubcategoriaServico.MANICURE,
    'maquiagem': SubcategoriaServico.MAQUIAGEM,

    // Transporte
    'mudanca': SubcategoriaServico.MUDANCA,
    'entregas': SubcategoriaServico.ENTREGAS,
    'transportepassageiros': SubcategoriaServico.TRANSPORTE_PASSAGEIROS,

    // Alimentação
    'culinaria': SubcategoriaServico.CULINARIA,
    'confeitaria': SubcategoriaServico.CONFEITARIA,
    'gastronomia': SubcategoriaServico.GASTRONOMIA
  };

  const subcategoriaEncontrada = subcategoriasMap[subcategoriaNormalizada];
  if (!subcategoriaEncontrada) {
    throw new Error('Subcategoria inválida');
  }

  return subcategoriaEncontrada;
} 