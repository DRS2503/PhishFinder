from flask import Blueprint, request, jsonify
from app.ml_pipeline.processors.predict import predict_email_body
from email import policy
from email.parser import BytesParser

predict_bp = Blueprint("predict", __name__)

def read_eml(raw: bytes) -> str:
    msg = BytesParser(policy=policy.default).parsebytes(raw)
    body = msg.get_body(preferencelist=("plain", "html"))
    return body.get_content() if body else msg.as_string()

@predict_bp.route("/api/predict", methods=["POST"])
def predict():
    text = ""

    f = request.files.get("file")
    if f:
        name = (f.filename or "").lower()
        raw = f.read()
        if name.endswith(".txt"):
            text = raw.decode("utf-8", errors="ignore")
        elif name.endswith(".eml"):
            text = read_eml(raw)
        else:
            return jsonify({"error": "Only .txt or .eml files are supported"}), 400
    else:
        data = request.get_json(silent=True) or request.form
        text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    return jsonify(predict_email_body(text))
