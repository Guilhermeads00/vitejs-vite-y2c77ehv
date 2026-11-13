# 🩺 MedAgenda — Sistema de Agendamento de Consultas Médicas

## 1. Sobre o projeto

O **MedAgenda** é uma aplicação web desenvolvida em Vue.js 3 para simular o agendamento de consultas médicas de forma simples, rápida e organizada.

O projeto foi desenvolvido na disciplina de **Front-End Frameworks**, do curso de Análise e Desenvolvimento de Sistemas (ADS), e evoluiu ao longo das atividades acadêmicas, incorporando componentização, reatividade, responsividade, Bootstrap 5, Vue Router e integração com uma API externa.

Na atualização mais recente, implementamos a integração com a **API ViaCEP**, permitindo ao paciente consultar seu endereço e selecionar uma das unidades fictícias do MedAgenda antes de confirmar o agendamento.

## 2. Integrantes da equipe

- Guilherme da Rocha da Silva
- Enzo Lira da Silva
- Fernando Noronha Braga da Silva
- Salomão Bayonas Miranda Ribeiro

**Curso:** Análise e Desenvolvimento de Sistemas  
**Disciplina:** Front-End Frameworks  
**Professor:** André Neto

## 3. Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| Vue.js 3 | Componentes e interface reativa |
| JavaScript | Lógica, eventos, validações e integração com API |
| Vue Router 4 | Navegação SPA entre as páginas |
| Bootstrap 5 | Estilização e responsividade |
| HTML e CSS | Estrutura e identidade visual |
| Vite | Ambiente de desenvolvimento |
| StackBlitz | Desenvolvimento e testes |
| API ViaCEP | Consulta de endereços por CEP |
| localStorage | Armazenamento local dos agendamentos |

O MedAgenda utiliza uma API pública para consultar endereços, mas não possui um back-end próprio para gerenciar consultas médicas.

## 4. Funcionalidades do sistema

O MedAgenda permite:

- Visualizar os profissionais e suas especialidades.
- Selecionar um médico e iniciar um agendamento.
- Preencher nome do paciente, data e horário.
- Formatar automaticamente a data e o horário.
- Impedir datas inexistentes, passadas e horários inválidos.
- Consultar endereços brasileiros por CEP.
- Visualizar três unidades fictícias de atendimento.
- Receber uma sugestão de unidade com base na cidade do CEP consultado.
- Selecionar a unidade desejada.
- Confirmar o agendamento com a unidade escolhida.
- Consultar e cancelar agendamentos.
- Manter os agendamentos salvos no navegador utilizando `localStorage`.
- Navegar entre páginas sem recarregar toda a aplicação.

A interface também possui estilos responsivos para diferentes tamanhos de tela.

## 5. Organização das páginas com Vue Router

O projeto utiliza Vue Router 4 para implementar uma **Single Page Application (SPA)**.

Uma SPA permite navegar entre diferentes páginas da aplicação sem recarregar todo o documento HTML.

As rotas implementadas são:

| Rota | Componente | Funcionalidade |
|---|---|---|
| `/` | `InicioView.vue` | Página inicial |
| `/medicos` | `MedicosView.vue` | Listagem dos médicos |
| `/agendar` | `AgendarView.vue` | Formulário de agendamento e consulta de CEP |
| `/consultas` | `ConsultasView.vue` | Visualização das consultas registradas |

A configuração das rotas está localizada em `src/router/index.js`.

O componente `RouterLink` realiza a navegação, enquanto `RouterView` exibe a página correspondente à rota atual.

## 6. Evolução visual com Bootstrap 5

O Bootstrap 5 foi integrado ao projeto para melhorar a organização visual, os componentes e a responsividade.

A instalação foi realizada via npm, e o CSS do Bootstrap foi importado no arquivo `src/main.js`.

### Classes utilizadas

| Classe | Função |
|---|---|
| `container-xl` | Organiza a largura do conteúdo |
| `d-flex` | Alinha elementos com Flexbox |
| `align-items-center` | Centraliza elementos verticalmente |
| `shadow-sm` | Adiciona sombra suave |
| `rounded-4` | Arredonda bordas dos componentes |
| `p-4` | Aplica espaçamento interno |
| `form-control` | Padroniza campos de texto |
| `form-select` | Estiliza listas de seleção |
| `row` e `col-md-6` | Organizam elementos em colunas responsivas |
| `btn` | Aplica estilos básicos aos botões |
| `alert-danger` | Destaca mensagens de erro |

As principais melhorias visuais foram realizadas no cabeçalho, nos cards dos médicos e no formulário de agendamento.

Mantivemos também estilos CSS personalizados para preservar a identidade visual do MedAgenda.

---

# 7. Integração Front-End e Back-End com API

## 7.1 API escolhida

Escolhemos a **API ViaCEP**, um serviço público e gratuito utilizado para consultar informações de endereços brasileiros.

A API foi escolhida porque permite acrescentar ao MedAgenda uma funcionalidade relacionada à localização das unidades de atendimento, sem exigir a criação de um servidor próprio.

**Site da API:** https://viacep.com.br/

**Endpoint utilizado:**

`https://viacep.com.br/ws/{cep}/json/`

**Exemplo de requisição:**

`https://viacep.com.br/ws/01001000/json/`

**Método HTTP:** GET  
**Formato dos dados:** JSON  
**Biblioteca utilizada:** `fetch()` nativo do JavaScript

Não é necessário cadastrar uma conta ou gerar uma chave de API para utilizar essa consulta pública.

## 7.2 Como funciona a integração

A integração ocorre na página **Agendar**, dentro do componente `ConsultaCep.vue`.

O funcionamento segue estas etapas:

1. O paciente informa seu CEP.
2. O sistema verifica se foram digitados oito números.
3. Ao clicar em **Buscar unidade**, é realizada uma requisição HTTP GET à API ViaCEP.
4. A API retorna os dados do endereço em formato JSON.
5. O JavaScript interpreta a resposta recebida.
6. O Vue atualiza a interface com o endereço encontrado.
7. O sistema mostra as três unidades cadastradas e destaca uma unidade da mesma cidade, quando disponível.
8. O paciente escolhe a unidade onde deseja ser atendido.
9. A unidade selecionada é registrada junto aos demais dados da consulta.

A consulta do CEP é feita em tempo de execução, utilizando uma API externa.

## 7.3 Código da requisição HTTP GET

A lógica de comunicação com a API está localizada em:

`src/services/cep.js`

Trecho utilizado:

```javascript
const resposta = await fetch(
  `https://viacep.com.br/ws/${cep}/json/`,
  {
    method: 'GET'
  }
)

const dados = await resposta.json()
```

A função `fetch()` realiza a requisição HTTP.

O `await` aguarda a conclusão da operação assíncrona.

O método `resposta.json()` interpreta o corpo da resposta e disponibiliza os dados em um objeto JavaScript.

Antes de utilizar a resposta, o código também verifica possíveis erros HTTP e a indicação de CEP inexistente retornada pelo ViaCEP.

## 7.4 Processamento dos dados JSON

A API pode retornar informações como:

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "bairro": "Sé",
  "localidade": "São Paulo",
  "uf": "SP"
}
```

O MedAgenda utiliza os dados relevantes para apresentar o endereço consultado.

Os campos utilizados incluem CEP, logradouro, bairro, município e estado.

No serviço `cep.js`, o campo `localidade` é convertido para `cidade`, facilitando sua utilização nos componentes.

## 7.5 Programação assíncrona

A consulta utiliza `async` e `await`.

A programação assíncrona permite que a aplicação faça uma requisição à API sem bloquear toda a interface enquanto aguarda a resposta.

No componente, também utilizamos `try`, `catch` e `finally` para controlar o processamento da requisição e os possíveis problemas.

## 7.6 Recursos de Vue utilizados na integração

**`ref()`**

Armazena informações reativas, como o CEP, o endereço encontrado, os estados de carregamento e as mensagens de erro.

**`v-model`**

Conecta o campo de CEP à variável correspondente.

**`v-if`**

Controla a exibição dos resultados, mensagens e indicadores de carregamento.

**`v-for`**

Percorre a lista das três unidades e apresenta seus cartões dinamicamente.

**Interpolação**

Apresenta valores das variáveis no HTML, utilizando a sintaxe `{{ ... }}`.

**`@click`**

Executa a pesquisa do CEP e permite selecionar a unidade desejada.

**Props e eventos personalizados**

Permitem que o componente `ConsultaCep.vue` comunique a unidade escolhida à página de agendamento.

## 7.7 Tratamento de carregamento, erros e ausência de resultados

Foram implementados diferentes estados para melhorar a experiência do usuário.

| Situação | Comportamento do sistema |
|---|---|
| Carregando | Mostra “Consultando...” e desabilita o botão |
| CEP incompleto | Solicita um CEP válido com oito números |
| Erro de rede ou HTTP | Exibe uma mensagem de erro |
| CEP inexistente | Informa que o endereço não foi encontrado |
| CEP encontrado | Mostra o endereço e as unidades disponíveis |
| Nenhuma unidade selecionada | Impede a confirmação do agendamento |

Esses tratamentos evitam que a interface apresente informações incorretas ou permita o envio de um agendamento incompleto.

---

# 8. Unidades de atendimento

Para integrar a consulta de CEP ao formulário, cadastramos três unidades fictícias do MedAgenda.

| Unidade | Localização de referência |
|---|---|
| Unidade BR-316 | Região da BR-316, Marituba/PA |
| Unidade Umarizal | Bairro Umarizal, Belém/PA |
| Unidade Cidade Nova | Bairro Cidade Nova, Ananindeua/PA |

As unidades estão cadastradas em:

`src/services/unidades.js`

## 8.1 Indicação da unidade

Após a consulta do CEP, o sistema identifica o município informado pela API.

Quando existe uma unidade cadastrada na mesma cidade, ela é destacada como sugestão.

Quando não existe unidade na cidade consultada, as três opções continuam disponíveis para escolha do paciente.

**Importante:** o sistema não calcula distâncias em quilômetros nem rotas de deslocamento. A indicação considera o município e, quando aplicável, a referência de bairro.

## 8.2 Seleção da unidade

As unidades são apresentadas em cartões clicáveis.

Quando o paciente seleciona uma unidade:

- O cartão escolhido recebe destaque visual.
- A identificação da unidade fica armazenada em uma variável reativa.
- O formulário exige uma unidade válida para confirmar o agendamento.
- A unidade escolhida é salva junto aos dados da consulta.
- A página **Minhas consultas** apresenta a unidade de atendimento selecionada.

O endereço pesquisado no ViaCEP não é armazenado junto ao agendamento; somente a unidade escolhida é registrada.

## 8.3 Armazenamento dos agendamentos

Os agendamentos são armazenados no