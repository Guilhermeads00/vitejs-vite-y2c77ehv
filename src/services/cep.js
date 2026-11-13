// Serviço responsável pela comunicação HTTP com a API ViaCEP.
// Recebe um CEP e devolve um endereço simplificado, ou null se ele não existir.
export async function buscarEnderecoPorCep(cepInformado) {
  const cep = String(cepInformado).replace(/\D/g, '')

  if (cep.length !== 8) {
    throw new Error('Digite um CEP válido com 8 números.')
  }

  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    method: 'GET',
  })

  if (!resposta.ok) {
    throw new Error('Não foi possível consultar o CEP. Tente novamente.')
  }

  // Converte o corpo da resposta HTTP para um objeto JavaScript.
  const dados = await resposta.json()

  // A ViaCEP pode responder HTTP 200 com { erro: true }.
  if (dados.erro) {
    return null
  }

  return {
    cep: dados.cep,
    logradouro: dados.logradouro || '',
    bairro: dados.bairro || '',
    cidade: dados.localidade || 'Não informado',
    uf: dados.uf || 'Não informado',
  }
}
