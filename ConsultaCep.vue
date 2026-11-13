<script setup>
import { ref } from 'vue'
import { buscarEnderecoPorCep } from '../services/cep.js'
import { unidades, sugerirUnidade } from '../services/unidades.js'

const cep = ref('')
const carregando = ref(false)
const mensagemErroCep = ref('')
const buscaFinalizada = ref(false)
const endereco = ref(null)
const sugestao = ref(null)

function limparResultado() {
  endereco.value = null
  sugestao.value = null
  mensagemErroCep.value = ''
  buscaFinalizada.value = false
}

function formatarCep() {
  const numeros = cep.value.replace(/\D/g, '').slice(0, 8)
  cep.value = numeros.length > 5
    ? numeros.slice(0, 5) + '-' + numeros.slice(5)
    : numeros
  limparResultado()
}

async function consultarCep() {
  if (carregando.value) return

  carregando.value = true
  limparResultado()

  try {
    const dados = await buscarEnderecoPorCep(cep.value)
    endereco.value = dados
    if (dados) sugestao.value = sugerirUnidade(dados)
  } catch (erro) {
    mensagemErroCep.value = erro.message || 'Não foi possível consultar o CEP.'
  } finally {
    carregando.value = false
    buscaFinalizada.value = true
  }
}
</script>

<template>
  <section class="consulta-cep" aria-labelledby="titulo-consulta-cep">
    <div class="d-flex align-items-start gap-3 mb-3">
      <span class="icone-consulta-cep" aria-hidden="true">⌖</span>
      <div>
        <h2 id="titulo-consulta-cep" class="h5 fw-bold mb-1">Encontre uma unidade perto de você</h2>
        <p class="text-muted small mb-0">Informe seu CEP para ver as unidades disponíveis e identificar uma opção na sua cidade.</p>
      </div>
    </div>

    <form @submit.prevent="consultarCep" class="row g-2 align-items-end" novalidate>
      <div class="col-12 col-sm-8">
        <label for="cep-paciente" class="form-label">Seu CEP</label>
        <input
          id="cep-paciente"
          v-model="cep"
          @input="formatarCep"
          type="text"
          inputmode="numeric"
          autocomplete="postal-code"
          maxlength="9"
          placeholder="00000-000"
          class="form-control"
          :disabled="carregando"
        />
      </div>
      <div class="col-12 col-sm-4">
        <button class="btn btn-principal w-100 py-3" type="submit" :disabled="carregando">
          {{ carregando ? 'Consultando...' : 'Buscar unidade' }}
        </button>
      </div>
    </form>

    <p v-if="carregando" class="text-info fw-semibold small mt-2 mb-0" role="status" aria-live="polite">
      Consultando endereço...
    </p>

    <p v-if="mensagemErroCep" class="alert alert-danger rounded-3 mt-3 mb-0" role="alert">
      {{ mensagemErroCep }}
    </p>

    <!-- Endereço e unidades só aparecem depois de uma consulta bem-sucedida. -->
    <div v-if="endereco" class="resultado-cep rounded-3 mt-3 p-3" aria-live="polite">
      <p class="small mb-1">
        <strong>Endereço:</strong>
        {{ endereco.bairro ? endereco.bairro + ' · ' : '' }}{{ endereco.cidade }}/{{ endereco.uf }}
        <span v-if="endereco.logradouro"> · {{ endereco.logradouro }}</span>
        <span class="text-muted">(CEP {{ endereco.cep }})</span>
      </p>
      <p v-if="sugestao" class="small mb-2 texto-indicacao">
        Unidade indicada para sua cidade: <strong>{{ sugestao.unidade.nome }}</strong>.
      </p>
      <p v-else class="small mb-2 text-muted">
        Não há unidade cadastrada nessa cidade. Confira as três opções disponíveis:
      </p>

      <div class="row g-2">
        <div v-for="unidade in unidades" :key="unidade.id" class="col-12 col-md-4">
          <div
            class="unidade-card rounded-3 py-2 px-3 h-100"
            :class="{ 'unidade-card-destaque': sugestao && sugestao.unidade.id === unidade.id }"
          >
            <div class="d-flex flex-wrap align-items-center gap-2">
              <strong class="small">{{ unidade.nome }}</strong>
              <span v-if="sugestao && sugestao.unidade.id === unidade.id" class="selo-mini">Na sua cidade</span>
            </div>
            <span class="small text-muted">{{ unidade.cidade }}/{{ unidade.uf }} · {{ unidade.referencia }}</span>
          </div>
        </div>
      </div>
      <p class="aviso-cep text-muted mt-2 mb-0">
        Indicação por cidade e bairro, não por distância. Unidades fictícias para demonstração.
      </p>
    </div>

    <p v-else-if="buscaFinalizada && !mensagemErroCep && !carregando" class="alert alert-warning rounded-3 mt-3 mb-0" role="status">
      Nenhum endereço foi encontrado para esse CEP.
    </p>
  </section>
</template>

<style scoped>
.consulta-cep {
  background: #f8fbfd;
  border: 1px solid #dcebf0;
  border-radius: 16px;
  padding: clamp(16px, 3vw, 24px);
}
.icone-consulta-cep {
  align-items: center;
  background: #dff7fc;
  border-radius: 12px;
  color: #0891b2;
  display: inline-flex;
  flex: 0 0 40px;
  font-size: 25px;
  height: 40px;
  justify-content: center;
}
.resultado-cep {
  background: #ecfeff;
  border: 1px solid #a5eff5;
}
.texto-indicacao { color: #056a7d; }
.unidade-card {
  background: #ffffff;
  border: 1px solid #dcebf0;
}
.unidade-card-destaque {
  border-color: #0891b2;
  background: #f0fcff;
}
.selo-mini {
  color: #056a7d;
  font-size: 11px;
  font-weight: 700;
}
.aviso-cep { font-size: 11px; line-height: 1.5; }
</style>
