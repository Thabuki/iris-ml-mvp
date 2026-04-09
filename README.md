# MVP Acadêmico - Classificação de Espécies de Íris

## Identificação

- **Aluno:** Thales Rebelo
- **Curso:** Pós-graduação em Engenharia de Software
- **Disciplina:** Sprint: Qualidade de Software, Segurança e Sistemas Inteligentes

## Contexto do projeto

Este projeto acadêmico integra o desenvolvimento do MVP da disciplina e tem como objetivo classificar espécies de flores Íris por meio de técnicas de machine learning. O modelo foi construído a partir de práticas como separação treino/teste (holdout), padronização com `StandardScaler`, comparação entre algoritmos como KNN, Árvore de Decisão, Naive Bayes e SVM, além de otimização de hiperparâmetros e validação cruzada.

## Estrutura do projeto

- **colab_ml_mvp.ipynb**: notebook principal do projeto, preparado para entrega e execução no Google Colab.
- **backend/**: API Flask, artefatos do modelo, dependências e teste automatizado.
- **frontend/**: interface web construída com HTML, CSS e JavaScript puros.
- **.venv/**: ambiente virtual Python local.

### Estrutura resumida

```text
iris-ml-mvp/
├── colab_ml_mvp.ipynb
├── backend/
│   ├── app.py
│   ├── model.pkl
│   ├── scaler.pkl
│   ├── requirements.txt
│   ├── README.md
│   └── tests/
│       └── test_model_performance.py
├── frontend/
│   ├── index.html
│   ├── README.md
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── img/
└── README.md
```

## Entrega / Arquivos principais

Para submissão e revisão do projeto, os arquivos e pastas principais são:

- [colab_ml_mvp.ipynb](colab_ml_mvp.ipynb): notebook principal com o pipeline completo de machine learning, documentado em formato de relatório e preparado para execução no Google Colab.
- [backend/](backend): pasta da aplicação backend em Flask.
- [backend/app.py](backend/app.py): endpoint de predição e carregamento do modelo exportado.
- [backend/tests/test_model_performance.py](backend/tests/test_model_performance.py): teste automatizado em PyTest com critérios mínimos de desempenho.
- [frontend/](frontend): pasta da interface web.
- [frontend/index.html](frontend/index.html): página principal do frontend.

Se o repositório for compartilhado com avaliadores, recomenda-se usar [colab_ml_mvp.ipynb](colab_ml_mvp.ipynb) como ponto de entrada principal para a parte de machine learning e as pastas [backend/](backend) e [frontend/](frontend) como ponto de entrada da aplicação full stack.

## Como executar o projeto completo

Antes de executar a aplicação, recomenda-se abrir o notebook [colab_ml_mvp.ipynb](colab_ml_mvp.ipynb) no Google Colab para consultar o processo completo de treinamento, comparação de modelos e exportação dos artefatos utilizados pelo backend.

### 1) Preparar o ambiente virtual

Na raiz do projeto, crie o ambiente virtual:

`python -m venv .venv`

Ative o ambiente virtual:

- **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
- **Windows (Prompt/cmd):** `.venv\Scripts\activate.bat`
- **Linux/Mac:** `source .venv/bin/activate`

### 2) Instalar as dependências do backend

Acesse a pasta `backend` e execute:

`pip install -r requirements.txt`

### 3) Executar o backend

Ainda na pasta `backend`, execute:

`python app.py`

A API ficará disponível em `http://localhost:5000`.

### 4) Executar o frontend

Acesse a pasta `frontend` e abra o arquivo `index.html` em um navegador.

Se desejar, também é possível utilizar uma extensão de servidor local, como o Five Server, que eu pessoalmente uso, para servir os arquivos estáticos durante os testes.

### 5) Testar o fluxo completo

1. Certifique-se de que o backend está em execução.
2. Abra a interface do frontend no navegador.
3. Preencha os quatro atributos da flor:
   - `Comprimento da Sépala`
   - `Largura da Sépala`
   - `Comprimento da Pétala`
   - `Largura da Pétala`
4. A predição é atualizada automaticamente conforme os valores são alterados.
5. Verifique o resultado exibido na página e a imagem correspondente da classe prevista.

### 5.1) Validações visuais implementadas no frontend

- O resultado é atualizado automaticamente, sem botão de envio.
- Os campos exibem o sufixo visual `cm` de forma dinâmica.
- Há botões próprios para aumentar ou diminuir os valores.
- Quando um valor sai da faixa esperada pelo modelo, um aviso discreto é exibido ao lado do campo.
- Enquanto os dados ainda não são suficientes para prever, a interface pode exibir uma imagem de espera, caso o arquivo exista na pasta `frontend/img/`.

### 6) Executar o teste automatizado do modelo (PyTest)

Na pasta `backend`, execute:

`pytest -q`

Esse teste aplica métricas de desempenho com thresholds mínimos para evitar a substituição do modelo por uma versão com qualidade inferior.

## Resultado esperado

O sistema deve enviar os dados do frontend para o endpoint `/predict` do backend e retornar uma das seguintes classes:

- `setosa`
- `versicolor`
- `virginica`

## Observações

- O projeto foi desenvolvido com foco em simplicidade, clareza e finalidade didática.
- O backend e o frontend foram organizados em diretórios separados para facilitar manutenção e entendimento.
- O notebook principal foi mantido na raiz do repositório para facilitar a localização durante a submissão e a correção.
- Este projeto possui finalidade exclusivamente acadêmica.
