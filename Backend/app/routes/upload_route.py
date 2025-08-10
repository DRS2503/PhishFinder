import os
import zipfile
import joblib
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from email import policy
from email.parser import BytesParser

upload_blueprint = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"csv", "zip", "txt", "eml"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# --- Ensemble model path (required) ---
pipeline_path = os.path.join(
    os.path.dirname(__file__),
    "../ml_pipeline/models/phishfinder_ensemble.pkl"
)

# Force-load the ensemble; fail fast if missing
try:
    pipeline_model = joblib.load(pipeline_path)
    print(" Ensemble pipeline loaded successfully")
except Exception as e:
    raise RuntimeError(f"Failed to load ensemble pipeline at {pipeline_path}: {e}")


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_email_content(file_path: str) -> str:
    """
    Extract text content from a .eml file on disk.
    Prefers text/plain, falls back to first text/* or raw.
    Includes Subject in the returned text.
    """
    try:
        with open(file_path, "rb") as f:
            msg = BytesParser(policy=policy.default).parsebytes(f.read())

        subject = msg.get("Subject", "") or ""
        if msg.is_multipart():
            # Prefer plain text
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    return f"{subject} {part.get_content()}"
            # Fallback: first text part
            for part in msg.walk():
                if part.get_content_maintype() == "text":
                    return f"{subject} {part.get_content()}"
            body = msg.get_body(preferencelist=("plain", "html"))
            text = body.get_content() if body else msg.as_string()
            return f"{subject} {text}"
        else:
            try:
                text = msg.get_content()
            except Exception:
                text = msg.as_string()
            return f"{subject} {text}"
    except Exception:
        # Last resort: read as utf-8 text
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()


def predict_phishing(text: str) -> dict:
    """
    Predict phishing using the ensemble pipeline (must expose predict_proba).
    Returns {"result": "Phishing"|"Safe", "confidence": "NN.N%"}.
    """
    text = (text or "").strip()
    if not text:
        return {"result": "Safe", "confidence": "N/A"}

    proba = pipeline_model.predict_proba([text])[0]  # [P(Safe), P(Phishing)]
    pred = int(proba[1] >= 0.5)
    label = "Phishing" if pred == 1 else "Safe"
    conf = proba[1] if pred == 1 else proba[0]
    return {"result": label, "confidence": f"{conf:.1%}"}


@upload_blueprint.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        try:
            if filename.lower().endswith(".zip"):
                phishing_results = []
                with zipfile.ZipFile(save_path, "r") as zip_ref:
                    for zipped_name in zip_ref.namelist():
                        with zip_ref.open(zipped_name) as f:
                            raw = f.read()
                            name_lower = zipped_name.lower()

                            if name_lower.endswith(".eml"):
                                # Parse .eml from bytes
                                try:
                                    msg = BytesParser(policy=policy.default).parsebytes(raw)
                                    subject = msg.get("Subject", "") or ""
                                    body = msg.get_body(preferencelist=("plain", "html"))
                                    content = f"{subject} {(body.get_content() if body else msg.as_string())}"
                                except Exception:
                                    content = raw.decode("utf-8", errors="ignore")
                            else:
                                # Treat .txt/.csv (or others) as utf-8 text
                                content = raw.decode("utf-8", errors="ignore")

                            result = predict_phishing(content)
                            phishing_results.append({
                                "file": zipped_name,
                                "result": result["result"],
                                "confidence": result["confidence"],
                            })

                final_result = "Phishing" if any(r["result"] == "Phishing" for r in phishing_results) else "Safe"

                return jsonify({
                    "filename": filename,
                    "result": final_result,
                    "details": phishing_results,
                    "message": "ZIP file analyzed successfully",
                })

            else:
                if filename.lower().endswith(".eml"):
                    content = extract_email_content(save_path)
                else:
                    # .txt, .csv treated as plain text 
                    with open(save_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                result = predict_phishing(content)
                return jsonify({
                    "filename": filename,
                    "result": result["result"],
                    "confidence": result["confidence"],
                    "message": "File analyzed successfully",
                })

        finally:
            if os.path.exists(save_path):
                os.remove(save_path)

    return jsonify({"error": "File type not allowed"}), 400
