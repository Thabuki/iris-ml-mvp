# Frontend - Classificação de Espécies de Íris

## Identificação do aluno

- **Aluno:** Thales Rebelo
- **Curso:** Pós-graduação em Engenharia de Software
- **Disciplina:** Sprint: Qualidade de Software, Segurança e Sistemas Inteligentes

## Contexto do projeto

Este frontend compõe o MVP acadêmico da disciplina e tem como finalidade oferecer uma interface simples para submissão dos atributos de uma flor Íris ao serviço de classificação desenvolvido em machine learning.

## Funcionamento da interface

A interface foi construída com HTML e JavaScript puros, sem uso de frameworks. O formulário apresenta quatro campos numéricos correspondentes às variáveis de entrada do modelo:

- `sepal_length`
- `sepal_width`
- `petal_length`
- `petal_width`

Ao preencher os campos, a interface envia automaticamente os dados ao backend e atualiza o resultado em tempo real (sem necessidade de botão de envio).

O resultado é apresentado no formato:

- `Nome comum - Nome científico`

Exemplo:

- `Virginica - Iris virginica`

Além do texto, a interface exibe uma imagem correspondente à classe prevista a partir da pasta `img/`.

Para manter a organização do frontend, os arquivos foram separados por responsabilidade:

- `index.html`: estrutura da página
- `css/styles.css`: regras de estilo
- `js/script.js`: lógica da interface e chamada à API
- `img/`: imagens das classes (`setosa`, `versicolor`, `virginica`) e arquivos de fundo (`background.avif`/`background.jpg`)

## Recursos implementados na interface

- atualização automática da predição sem botão de envio;
- exibição do resultado no formato `Nome comum - Nome científico`;
- imagem associada à espécie prevista;
- imagem de espera opcional enquanto os dados ainda não estão completos;
- validação visual de mínimo e máximo por campo;
- sufixo visual `cm` junto ao valor digitado;
- controles customizados de incremento e decremento;
- layout responsivo e centralizado.

## Comunicação com o backend

A comunicação ocorre via requisição HTTP `POST` para `http://localhost:5000/predict`, utilizando `fetch()` e conteúdo no formato JSON. O frontend interpreta a resposta e apresenta ao usuário a espécie prevista (`setosa`, `versicolor` ou `virginica`).

## Instruções para execução

1. Certifique-se de que o backend esteja em execução na porta `5000`.
2. Acesse a pasta `frontend`.
3. Abra o arquivo `index.html` em um navegador web.
4. Preencha os quatro campos para obter a predição de forma automática.

## Comentários e manutenção

Os arquivos `index.html`, `css/styles.css` e `js/script.js` foram comentados em português para facilitar a apresentação do projeto e a compreensão do fluxo de interface, validação e comunicação com a API.

## Observações

- Este componente foi projetado para ser mínimo, didático e compatível com os objetivos de um MVP acadêmico.
- Caso se deseje maior escalabilidade futura, a pasta `img/` pode ser subdividida entre `classes/`, `background/` e `ui/` sem alterar o conceito atual do projeto.
- Este projeto possui finalidade exclusivamente acadêmica e integra o desenvolvimento do MVP da disciplina.
