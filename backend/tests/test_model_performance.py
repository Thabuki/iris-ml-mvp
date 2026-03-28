"""Teste automatizado de desempenho mínimo do modelo de classificação."""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, f1_score


# Localiza os artefatos a partir da pasta do backend.
BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"

# Requisitos mínimos de desempenho definidos para o MVP
MIN_ACCURACY = 0.90
MIN_F1_MACRO = 0.90


LABEL_TO_CLASS = {
    "setosa": 0,
    "versicolor": 1,
    "virginica": 2,
}


def _normalize_predictions(predictions: np.ndarray) -> np.ndarray:
    """Converte predições para rótulos numéricos 0, 1, 2."""
    predictions = np.asarray(predictions)

    # Alguns modelos podem devolver strings; aqui normalizamos tudo para inteiros.
    if predictions.dtype.kind in {"U", "S", "O"}:
        normalized = [
            LABEL_TO_CLASS[str(pred).strip().lower()]
            for pred in predictions
        ]
        return np.asarray(normalized, dtype=int)

    return predictions.astype(int)


def test_model_meets_minimum_performance_requirements() -> None:
    """Garante que o modelo persistido mantém o nível mínimo de qualidade."""

    # Carrega os artefatos salvos no projeto.
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    # Usa o conjunto Iris inteiro para uma validação rápida de regressão do modelo.
    iris = load_iris()
    # Envolve os dados em um DataFrame com os mesmos nomes de colunas usados no treinamento,
    # evitando o aviso de feature names incompatíveis do StandardScaler.
    x = pd.DataFrame(
        iris.data,
        columns=["sepal_length", "sepal_width", "petal_length", "petal_width"],
    )
    y_true = iris.target

    # Replica o fluxo de pré-processamento + predição da aplicação.
    x_scaled = scaler.transform(x)
    y_pred = model.predict(x_scaled)
    y_pred = _normalize_predictions(y_pred)

    # Calcula as métricas que funcionam como critério de aceite do MVP.
    accuracy = accuracy_score(y_true, y_pred)
    f1_macro = f1_score(y_true, y_pred, average="macro")

    assert accuracy >= MIN_ACCURACY, (
        "Accuracy abaixo do mínimo exigido. "
        f"Obtido: {accuracy:.4f} | Mínimo: {MIN_ACCURACY:.2f}"
    )

    assert f1_macro >= MIN_F1_MACRO, (
        "F1-macro abaixo do mínimo exigido. "
        f"Obtido: {f1_macro:.4f} | Mínimo: {MIN_F1_MACRO:.2f}"
    )
