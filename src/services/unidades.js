// Unidades fictícias para demonstração acadêmica do MedAgenda.
// Os locais são referências de bairro/rodovia, não endereços completos.
export const unidades = [
  {
    id: 'marituba',
    nome: 'Unidade BR-316',
    referencia: 'Região da BR-316',
    cidade: 'Marituba',
    uf: 'PA',
    bairroReferencia: '',
  },
  {
    id: 'belem',
    nome: 'Unidade Umarizal',
    referencia: 'Bairro Umarizal',
    cidade: 'Belém',
    uf: 'PA',
    bairroReferencia: 'Umarizal',
  },
  {
    id: 'ananindeua',
    nome: 'Unidade Cidade Nova',
    referencia: 'Bairro Cidade Nova',
    cidade: 'Ananindeua',
    uf: 'PA',
    bairroReferencia: 'Cidade Nova',
  },
]

function normalizar(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// O ViaCEP informa cidade e bairro, mas não fornece a distância até uma clínica.
// Por isso, esta função INDICA uma unidade da mesma cidade quando existir;
// não afirma qual é realmente a mais próxima em quilômetros.
export function sugerirUnidade(endereco) {
  if (!endereco || normalizar(endereco.uf) !== 'pa') return null

  const cidade = normalizar(endereco.cidade)
  const bairro = normalizar(endereco.bairro)
  const unidade = unidades.find((item) => normalizar(item.cidade) === cidade)

  if (!unidade) return null

  const bairroCoincide = unidade.bairroReferencia &&
    bairro.includes(normalizar(unidade.bairroReferencia))

  return {
    unidade,
    criterio: bairroCoincide
      ? 'O bairro encontrado no CEP corresponde à região desta unidade.'
      : 'Esta unidade fica no mesmo município informado pelo CEP.',
  }
}
