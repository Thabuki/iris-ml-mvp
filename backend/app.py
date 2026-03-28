"""API Flask do MVP de classificação de espécies de Íris."""

from pathlib import Path

import joblib
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS


# Inicializa a aplicação Flask e libera CORS para o frontend local.
app = Flask(__name__)
CORS(app)

# Define os caminhos dos artefatos treinados a partir da pasta do backend.
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"

# Carrega o modelo e o scaler uma única vez na inicialização da API.
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Mapeia saídas numéricas do modelo para nomes legíveis das classes.
CLASS_MAP = {
	0: "setosa",
	1: "versicolor",
	2: "virginica",
}

# Lista os campos obrigatórios esperados no corpo da requisição.
REQUIRED_FIELDS = [
	"sepal_length",
	"sepal_width",
	"petal_length",
	"petal_width",
]


@app.route("/predict", methods=["POST"])
def predict():
	"""Recebe as medidas da flor e devolve a classe prevista."""

	# Lê o JSON de entrada sem gerar exceção caso o corpo esteja inválido.
	data = request.get_json(silent=True)

	if not data:
		return jsonify({"error": "JSON inválido ou ausente."}), 400

	# Verifica se todos os atributos necessários foram informados.
	missing_fields = [field for field in REQUIRED_FIELDS if field not in data]
	if missing_fields:
		return (
			jsonify({"error": f"Campos ausentes: {', '.join(missing_fields)}"}),
			400,
		)

	try:
		# Converte os valores recebidos para o formato numérico esperado pelo modelo.
		features = np.array(
			[
				[
					float(data["sepal_length"]),
					float(data["sepal_width"]),
					float(data["petal_length"]),
					float(data["petal_width"]),
				]
			]
		)
	except (TypeError, ValueError):
		return jsonify({"error": "Todos os campos devem ser numéricos."}), 400

	# Aplica o mesmo pré-processamento usado no treinamento.
	scaled_features = scaler.transform(features)
	# Executa a inferência e captura somente a primeira previsão.
	raw_prediction = model.predict(scaled_features)[0]

	# Aceita tanto modelos que retornam string quanto modelos que retornam índice numérico.
	if isinstance(raw_prediction, str):
		predicted_label = raw_prediction.lower()
	else:
		predicted_label = CLASS_MAP.get(int(raw_prediction), "classe_desconhecida")

	# Retorna a classe em JSON para consumo pelo frontend.
	return jsonify({"prediction": predicted_label})


if __name__ == "__main__":
	# Mantém a API acessível localmente durante a fase de desenvolvimento.
	app.run(host="0.0.0.0", port=5000, debug=True)
