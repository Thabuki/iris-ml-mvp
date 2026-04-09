// Elementos principais de saída visual da interface.
const resultElement =
  document.getElementById("result");
const predictionImage =
  document.getElementById(
    "predictionImage"
  );
const predictionImageContainer =
  document.getElementById(
    "predictionImageContainer"
  );

// Extensões aceitas ao tentar localizar imagens da interface.
const imageExtensions = [
  "png",
  "jpg",
  "jpeg",
  "webp",
];

// Mapeia o nome comum da classe para o nome científico exibido na tela.
const scientificNameMap = {
  setosa: "Iris setosa",
  versicolor: "Iris versicolor",
  virginica: "Iris virginica",
};

// Define os limites aceitáveis de entrada para cada atributo do formulário.
const fieldLimits = {
  sepal_length: {
    min: 4.3,
    max: 7.9,
  },
  sepal_width: {
    min: 2.0,
    max: 4.4,
  },
  petal_length: {
    min: 1.0,
    max: 6.9,
  },
  petal_width: {
    min: 0.1,
    max: 2.5,
  },
};

// Identificadores dos inputs que alimentam o modelo.
const inputIds = [
  "sepal_length",
  "sepal_width",
  "petal_length",
  "petal_width",
];

// Referências diretas aos elementos de input.
const inputElements = inputIds.map(
  (id) => document.getElementById(id)
);

// Botões customizados que substituem as setas nativas do campo numérico.
const stepButtons = Array.from(
  document.querySelectorAll(
    ".step-button"
  )
);

// Agrupa os contêineres dos inputs para permitir ajustes visuais dinâmicos.
const inputWrappers = inputElements.map(
  (input) => input.parentElement
);

// Relaciona cada campo ao respectivo popup de orientação de faixa.
const hintElements = inputIds.reduce(
  (acc, id) => {
    acc[id] = document.getElementById(
      `${id}_hint`
    );
    return acc;
  },
  {}
);

// Controla debounce de predição, ordem das respostas e estado atual da imagem.
let debounceTimer = null;
let latestRequestId = 0;
let currentImageMode = null;

function formatCommonName(name) {
  // Garante a exibição padronizada do nome comum da espécie.
  if (!name) {
    return "";
  }

  return (
    name.charAt(0).toUpperCase() +
    name.slice(1).toLowerCase()
  );
}

function hidePredictionImage() {
  // Remove a imagem e limpa o estado visual atual.
  currentImageMode = null;
  predictionImageContainer.classList.remove(
    "awaiting-state"
  );
  predictionImage.removeAttribute(
    "src"
  );
  predictionImageContainer.classList.add(
    "hidden"
  );
}

function showImageByName(
  imageBaseName,
  altText,
  imageMode
) {
  // Evita recarregar a mesma imagem quando nada mudou. Estava dando um flicker chato se era a mesma imagem.
  if (
    currentImageMode === imageMode &&
    !predictionImageContainer.classList.contains(
      "hidden"
    )
  ) {
    return;
  }

  let currentExtensionIndex = 0;

  const tryNextImage = () => {
    // Testa sequencialmente as extensões conhecidas até achar a imagem.
    if (
      currentExtensionIndex >=
      imageExtensions.length
    ) {
      hidePredictionImage();
      return;
    }

    const extension =
      imageExtensions[
        currentExtensionIndex
      ];

    predictionImage.src = `./img/${imageBaseName}.${extension}`;
    predictionImage.alt = altText;
  };

  predictionImage.onload = () => {
    // Ao carregar com sucesso, torna a imagem visível e registra o estado atual.
    currentImageMode = imageMode;
    predictionImageContainer.classList.remove(
      "hidden"
    );
  };

  predictionImage.onerror = () => {
    // Se falhar, tenta a próxima extensão possível.
    currentExtensionIndex += 1;
    tryNextImage();
  };

  tryNextImage();
}

function showPredictionImage(
  flowerName
) {
  // Exibe a imagem correspondente à classe prevista pelo backend.
  predictionImageContainer.classList.remove(
    "awaiting-state"
  );
  showImageByName(
    flowerName,
    `Imagem da flor ${flowerName}`,
    `prediction:${flowerName}`
  );
}

function showAwaitingInputImage() {
  // Mantém a imagem de espera enquanto os dados ainda não permitem prever.
  if (
    currentImageMode === "awaiting" &&
    !predictionImageContainer.classList.contains(
      "hidden"
    )
  ) {
    predictionImageContainer.classList.add(
      "awaiting-state"
    );
    return;
  }

  predictionImageContainer.classList.add(
    "awaiting-state"
  );

  const candidateNames = [
    "awaitnginput",
    "awaitinginput",
  ];

  let currentNameIndex = 0;

  const tryNextName = () => {
    // Tenta mais de um nome de arquivo para tolerar pequenas diferenças no asset.
    if (
      currentNameIndex >=
      candidateNames.length
    ) {
      hidePredictionImage();
      return;
    }

    const currentName =
      candidateNames[currentNameIndex];

    let currentExtensionIndex = 0;

    const tryNextExtension = () => {
      // Se o nome atual não existir em nenhuma extensão, passa para o próximo nome.
      if (
        currentExtensionIndex >=
        imageExtensions.length
      ) {
        currentNameIndex += 1;
        tryNextName();
        return;
      }

      const extension =
        imageExtensions[
          currentExtensionIndex
        ];

      predictionImage.src = `./img/${currentName}.${extension}`;
      predictionImage.alt =
        "Imagem de aguardando preenchimento";
    };

    predictionImage.onload = () => {
      // Marca a imagem de espera como carregada com sucesso.
      currentImageMode = "awaiting";
      predictionImageContainer.classList.remove(
        "hidden"
      );
    };

    predictionImage.onerror = () => {
      currentExtensionIndex += 1;
      tryNextExtension();
    };

    tryNextExtension();
  };

  tryNextName();
}

function getCurrentValues() {
  // Lê os valores atuais do formulário a cada ciclo de validação/predição.
  return {
    sepal_length:
      document.getElementById(
        "sepal_length"
      ).value,
    sepal_width:
      document.getElementById(
        "sepal_width"
      ).value,
    petal_length:
      document.getElementById(
        "petal_length"
      ).value,
    petal_width:
      document.getElementById(
        "petal_width"
      ).value,
  };
}

function hasAllValues(values) {
  // Confirma se todos os campos já foram preenchidos.
  return Object.values(values).every(
    (value) => value !== ""
  );
}

function hideHint(fieldId) {
  // Esconde o popup de orientação do campo informado.
  const hint = hintElements[fieldId];

  if (!hint) {
    return;
  }

  hint.textContent = "";
  hint.classList.remove("visible");
}

function showHint(fieldId, message) {
  // Exibe mensagem de orientação ao lado do campo inválido.
  const hint = hintElements[fieldId];

  if (!hint) {
    return;
  }

  hint.textContent = message;
  hint.classList.add("visible");
}

function validateRanges(values) {
  // Valida os limites mínimos e máximos aceitos pelo modelo.
  let hasOutOfRange = false;

  inputIds.forEach((fieldId) => {
    const rawValue = values[fieldId];

    if (rawValue === "") {
      hideHint(fieldId);
      return;
    }

    const numericValue =
      Number(rawValue);

    if (Number.isNaN(numericValue)) {
      showHint(
        fieldId,
        "Valor numérico inválido."
      );
      hasOutOfRange = true;
      return;
    }

    const limits = fieldLimits[fieldId];

    if (numericValue < limits.min) {
      showHint(
        fieldId,
        `Mínimo ${limits.min.toFixed(1)} cm`
      );
      hasOutOfRange = true;
      return;
    }

    if (numericValue > limits.max) {
      showHint(
        fieldId,
        `Máximo ${limits.max.toFixed(1)} cm`
      );
      hasOutOfRange = true;
      return;
    }

    hideHint(fieldId);
  });

  return hasOutOfRange;
}

function updateUnitPosition(input) {
  // Posiciona o sufixo "cm" imediatamente após o valor visível no campo.
  const wrapper = input.parentElement;

  if (!wrapper) {
    return;
  }

  const unit =
    wrapper.querySelector(".unit");
  const sizer = wrapper.querySelector(
    ".value-sizer"
  );

  if (!unit || !sizer) {
    return;
  }

  const inputValue = input.value;

  if (!inputValue) {
    // Sem valor, o sufixo é ocultado e volta à posição padrão.
    unit.classList.add("hidden-unit");
    wrapper.style.setProperty(
      "--unit-left",
      "14px"
    );
    return;
  }

  unit.classList.remove("hidden-unit");

  const computedStyle =
    window.getComputedStyle(input);
  const paddingLeft = parseFloat(
    computedStyle.paddingLeft
  );
  const paddingRight = parseFloat(
    computedStyle.paddingRight
  );

  sizer.style.font = computedStyle.font;
  sizer.style.fontSize =
    computedStyle.fontSize;
  sizer.style.fontWeight =
    computedStyle.fontWeight;
  sizer.style.letterSpacing =
    computedStyle.letterSpacing;
  sizer.textContent = inputValue;

  const valueWidth = sizer.offsetWidth;
  const textAreaWidth =
    input.clientWidth -
    paddingLeft -
    paddingRight;
  const textStart =
    paddingLeft +
    Math.max(
      (textAreaWidth - valueWidth) / 2,
      0
    );
  const maxLeft =
    wrapper.clientWidth - 30;
  const desiredLeft = Math.min(
    textStart + valueWidth + 6,
    maxLeft
  );

  wrapper.style.setProperty(
    "--unit-left",
    `${desiredLeft}px`
  );
}

function updateAllUnitPositions() {
  // Recalcula o sufixo de todos os campos, útil na carga inicial.
  inputElements.forEach((input) => {
    updateUnitPosition(input);
  });
}

async function predictFromInputs() {
  // Executa o fluxo completo: leitura, validação, chamada ao backend e atualização da interface.
  const values = getCurrentValues();
  const hasOutOfRange =
    validateRanges(values);

  if (
    !hasAllValues(values) ||
    hasOutOfRange
  ) {
    resultElement.textContent = "";
    showAwaitingInputImage();
    return;
  }

  const payload = {
    sepal_length: Number(
      values.sepal_length
    ),
    sepal_width: Number(
      values.sepal_width
    ),
    petal_length: Number(
      values.petal_length
    ),
    petal_width: Number(
      values.petal_width
    ),
  };

  const requestId =
    (latestRequestId += 1);

  try {
    // Envia os dados ao endpoint de predição da API Flask.
    const response = await fetch(
      "http://localhost:5000/predict",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // Ignora respostas antigas quando o usuário digita rapidamente.
    if (requestId !== latestRequestId) {
      return;
    }

    if (!response.ok) {
      resultElement.textContent = `Erro: ${data.error || "Falha na predição."}`;
      showAwaitingInputImage();
      return;
    }

    const predictionKey = String(
      data.prediction || ""
    ).toLowerCase();
    const commonName = formatCommonName(
      predictionKey
    );
    const scientificName =
      scientificNameMap[predictionKey];

    // Atualiza o resultado textual e a imagem associada à classe prevista.
    resultElement.textContent =
      scientificName
        ? `${commonName} - ${scientificName}`
        : commonName;
    showPredictionImage(predictionKey);
  } catch (error) {
    // Trata falhas de comunicação com o backend.
    if (requestId !== latestRequestId) {
      return;
    }

    resultElement.textContent =
      "Erro de conexão com o backend.";
    showAwaitingInputImage();
  }
}

function schedulePrediction() {
  // Adia levemente a predição para evitar chamadas excessivas ao backend.
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    predictFromInputs();
  }, 250);
}

inputElements.forEach((input) => {
  // Mantém o sufixo atualizado e agenda nova predição a cada alteração.
  input.addEventListener(
    "input",
    () => {
      updateUnitPosition(input);
      schedulePrediction();
    }
  );
});

stepButtons.forEach((button) => {
  // Implementa os controles customizados de incremento/decremento.
  button.addEventListener(
    "click",
    () => {
      const targetId =
        button.dataset.target;
      const direction =
        button.dataset.direction;
      const input =
        document.getElementById(
          targetId
        );

      if (!input) {
        return;
      }

      if (direction === "up") {
        input.stepUp();
      } else {
        input.stepDown();
      }

      // Dispara o mesmo fluxo do input manual para manter a interface sincronizada.
      input.dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
    }
  );
});

// Ajusta o sufixo na carga inicial e exibe a imagem padrão de espera.
updateAllUnitPositions();
showAwaitingInputImage();
