# Backend - Classificação de Espécies de Íris

## Identificação do aluno

- **Aluno:** Thales Rebelo
- **Curso:** Pós-graduação em Engenharia de Software
- **Disciplina:** Sprint: Qualidade de Software, Segurança e Sistemas Inteligentes

## Contexto do projeto

Este backend integra o MVP acadêmico da disciplina, cujo objetivo é classificar espécies de flores Íris por meio de algoritmos de machine learning. O projeto contempla práticas de qualidade e validação de modelos, incluindo separação treino/teste (holdout), padronização com StandardScaler, avaliação de algoritmos (KNN, Árvore de Decisão, Naive Bayes e SVM), otimização de hiperparâmetros e validação cruzada.

## Função do backend

A aplicação foi implementada com Flask e expõe um endpoint HTTP para inferência. No momento da inicialização, o sistema carrega os artefatos `model.pkl` e `scaler.pkl` para realizar o pré-processamento e a predição de classe.

## Estrutura interna do backend

- `app.py`: API Flask e regra de validação/predição.
- `model.pkl`: modelo de machine learning persistido.
- `scaler.pkl`: objeto de padronização usado antes da inferência.
- `requirements.txt`: dependências necessárias para execução e testes.
- `tests/test_model_performance.py`: teste automatizado de qualidade mínima do modelo.

## Endpoint de predição

- **Método:** `POST`
- **Rota:** `/predict`
- **Descrição:** Recebe quatro atributos numéricos da flor, aplica padronização com `scaler.transform()` e retorna a espécie prevista pelo modelo.

### Exemplo de requisição (JSON)

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

### Exemplo de resposta (JSON)

```json
{
  "prediction": "setosa"
}
```

## Instruções para execução

### 1) Criar e ativar ambiente virtual

Pense no ambiente virtual como uma “caixa separada” para as bibliotecas deste projeto.
Assim, o que você instala aqui não bagunça outros projetos no computador.

- Entre na pasta `backend`.

- Crie a caixa (ambiente virtual):

`python -m venv .venv`

- Ative a caixa:
  - **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
  - **Windows (Prompt/cmd):** `.venv\Scripts\activate.bat`
  - **Linux/Mac:** `source .venv/bin/activate`

- Quando estiver ativo, você verá algo como `(.venv)` no começo da linha do terminal.

### 2) Instalar dependências com o arquivo requirements.txt

O arquivo `requirements.txt` é uma lista pronta com as bibliotecas que o backend precisa para funcionar.
Em vez de instalar uma por uma, basta pedir ao Python para ler essa lista e instalar tudo de uma vez.

- Certifique-se de que o ambiente virtual ainda está ativo.

- Na pasta `backend`, execute:

`pip install -r requirements.txt`

- O que esse comando faz:
  - `pip install`: instala bibliotecas Python.
  - `-r requirements.txt`: diz ao `pip` para ler o arquivo `requirements.txt` e instalar tudo o que está listado nele.

- Quando a instalação terminar, o backend terá todas as dependências necessárias para a execução.

### 3) Executar o backend

- Inicie a aplicação:

`python app.py`

- O serviço ficará disponível em `http://localhost:5000`.
- O endpoint principal para consumo pelo frontend é `http://localhost:5000/predict`.

### 4) (Opcional) Sair do ambiente virtual

Quando terminar, execute:

- `deactivate`

## Teste automatizado com PyTest

Este projeto inclui um teste automatizado para validar o desempenho do modelo antes de uso/implantação. O objetivo é evitar a substituição do `model.pkl` por uma versão que não atenda aos requisitos mínimos definidos para o MVP.

Arquivo de teste:

- `tests/test_model_performance.py`

Métricas e thresholds definidos:

- `accuracy` mínima: `0.90`
- `f1_macro` mínimo: `0.90`

### Como executar o teste

1. Certifique-se de que o ambiente virtual está ativo.
2. Na pasta `backend`, execute:

`pytest -q`

### Tutorial rápido de PyTest

O PyTest é uma ferramenta que executa testes automaticamente. Neste projeto, ele verifica se o modelo atende aos requisitos mínimos de desempenho antes de ser aceito.

Passo a passo:

1. Abra o terminal na pasta `backend`.
2. Ative o ambiente virtual.
3. Instale dependências (caso ainda não tenha feito):

`pip install -r requirements.txt`

1. Execute o teste:

`pytest -q`

1. Leia o resultado:

- `1 passed`: teste aprovado.
- `1 failed`: teste reprovado (modelo abaixo dos thresholds definidos).

Executar somente o teste de desempenho do modelo:

`pytest -q tests/test_model_performance.py`

Onde está o teste:

- `tests/test_model_performance.py`

Como ele funciona, em termos simples:

- Carrega `model.pkl` e `scaler.pkl`.
- Faz predições no conjunto Iris.
- Calcula métricas (`accuracy` e `f1_macro`).
- Compara com os limites mínimos (`0.90` e `0.90`).
- Falha automaticamente se o modelo não cumprir os critérios.

### Interpretação do resultado

- Se o teste **passar**, o modelo atende aos requisitos mínimos de desempenho.
- Se o teste **falhar**, o modelo não atende aos limites estabelecidos e deve ser revisado antes de implantação.

## Observações

- O endpoint retorna erro HTTP 400 quando campos obrigatórios não são informados.
- O arquivo `requirements.txt` foi incluído para facilitar a instalação padronizada das dependências do projeto.
- O teste automatizado ajuda a evitar regressões caso `model.pkl` seja substituído no futuro.
- Este projeto possui finalidade exclusivamente acadêmica e integra o desenvolvimento do MVP da disciplina.
