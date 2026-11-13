
<script setup>
import { ref } from 'vue'
import { buscarEnderecoPorCep } from '../services/cep.js'
import { unidades, sugerirUnidade } from '../services/unidades.js'

const props = defineProps({
  unidadeSelecionada: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['selecionar-unidade'])

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
  emit('selecionar-unidade', '')
}

function escolherUnidade(unidade) {
  emit('selecionar-unidade', unidade.id)
}

async function consultarCep() {
  if (carregando.value) return

  carregando.value = true
  limparResultado()
  emit('selecionar-unidade', '')

  try {
    const dados = await buscarEnderecoPorCep(cep.value)

    endereco.value = dados

    if (dados) {
      sugestao.value = sugerirUnidade(dados)
    }
  } catch (erro) {
    mensagemErroCep.value =
      erro.message || 'Não foi possível consultar o CEP.'
  } finally {
    carregando.value = false
    buscaFinalizada.value = true
  }
}
</script>

<template>
  <section
    class="consulta-cep"
    aria-labelledby="titulo-consulta-cep"
  >
    <div class="d-flex align-items-start gap-3 mb-3">
      <span class="icone-consulta-cep" aria-hidden="true">
        ⌖
      </span>

      <div>
        <h2
          id="titulo-consulta-cep"
          class="h5 fw-bold mb-1"
        >
          Encontre uma unidade perto de você
        </h2>

        <p class="text-muted small mb-0">
          Informe seu CEP para ver as unidades disponíveis
          e identificar uma opção na sua cidade.
        </p>
      </div>
    </div>

    <div class="row g-2 align-items-end">
      <div class="col-12 col-sm-8">
        <label for="cep-paciente" class="form-label">
          Seu CEP
        </label>

        <input
          id="cep-paciente"
          v-model="cep"
          @input="formatarCep"
          @keydown.enter.prevent="consultarCep"
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
        <button
          class="btn btn-principal w-100 py-3"
          type="button"
          @click="consultarCep"
          :disabled="carregando"
        >
          {{ carregando ? 'Consultando...' : 'Buscar unidade' }}
        </button>
      </div>
    </div>

    <p
      v-if="carregando"
      class="text-info fw-semibold small mt-2 mb-0"
      role="status"
    >
      Consultando endereço...
    </p>

    <p
      v-if="mensagemErroCep"
      class="alert alert-danger rounded-3 mt-3 mb-0"
      role="alert"
    >
      {{ mensagemErroCep }}
    </p>

    <!-- As unidades só aparecem após buscar um CEP válido -->
    <div
      v-if="endereco"
      class="resultado-cep rounded-3 mt-3 p-3"
      aria-live="polite"
    >
      <p class="small mb-1">
        <strong>Endereço:</strong>

        {{ endereco.bairro ? endereco.bairro + ' · ' : '' }}
        {{ endereco.cidade }}/{{ endereco.uf }}

        <span v-if="endereco.logradouro">
          · {{ endereco.logradouro }}
        </span>

        <span class="text-muted">
          (CEP {{ endereco.cep }})
        </span>
      </p>

      <p
        v-if="sugestao"
        class="small mb-2 texto-indicacao"
      >
        Unidade indicada para sua cidade:
        <strong>{{ sugestao.unidade.nome }}</strong>.
      </p>

      <p v-else class="small mb-2 text-muted">
        Não há unidade cadastrada nessa cidade.
        Confira as três opções disponíveis:
      </p>

      <p class="small mb-2 fw-semibold">
        Escolha uma unidade para o atendimento:
      </p>

      <div class="row g-2">
        <div
          v-for="unidade in unidades"
          :key="unidade.id"
          class="col-12 col-md-4"
        >
          <button
            type="button"
            class="unidade-card rounded-3 py-2 px-3 h-100 w-100 text-start"
            :class="{
              'unidade-card-destaque':
                props.unidadeSelecionada === unidade.id
            }"
            :aria-pressed="
              props.unidadeSelecionada === unidade.id
            "
            @click="escolherUnidade(unidade)"
          >
            <div
              class="d-flex flex-wrap align-items-center gap-2"
            >
              <strong class="small">
                {{ unidade.nome }}
              </strong>

              <span
                v-if="
                  sugestao &&
                  sugestao.unidade.id === unidade.id
                "
                class="selo-mini"
              >
                Na sua cidade
              </span>

              <span
                v-if="
                  props.unidadeSelecionada === unidade.id
                "
                class="selo-mini selo-escolhida"
              >
                ✓ Selecionada
              </span>
            </div>

            <span class="small text-muted">
              {{ unidade.cidade }}/{{ unidade.uf }}
              · {{ unidade.referencia }}
            </span>
          </button>
        </div>
      </div>

      <p
        v-if="props.unidadeSelecionada"
        class="small fw-semibold texto-indicacao mt-2 mb-1"
        role="status"
      >
        A unidade selecionada será incluída no agendamento.
      </p>

      <p class="aviso-cep text-muted mt-2 mb-0">
        Indicação por cidade e bairro, não por distância.
        Unidades fictícias para demonstração.
      </p>
    </div>

    <p
      v-else-if="
        buscaFinalizada &&
        !mensagemErroCep &&
        !carregando
      "
      class="alert alert-warning rounded-3 mt-3 mb-0"
      role="status"
    >
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

.texto-indicacao {
  color: #056a7d;
}

.unidade-card {
  background: #ffffff;
  border: 1px solid #dcebf0;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.unidade-card:hover {
  border-color: #0891b2;
}

.unidade-card:focus-visible {
  outline: 3px solid #0891b2;
  outline-offset: 2px;
}

.unidade-card-destaque {
  border-color: #0891b2;
  background: #f0fcff;
}

.selo-escolhida {
  background: #cefafe;
  border-radius: 5px;
  padding: 2px 5px;
}

.selo-mini {
  color: #056a7d;
  font-size: 11px;
  font-weight: 700;
}

.aviso-cep {
  font-size: 11px;
  line-height: 1.5;
}
</style>
