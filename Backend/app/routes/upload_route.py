import zipfile
import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

upload_blueprint = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"csv", "zip", "txt", "eml"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def dummy_predict_phishing(text):
    # Placeholder for ML model
    if "urgent" in text.lower():
        return "Phishing"
    return "Safe"

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

        if filename.endswith("zip"):
            with zipfile.ZipFile(save_path, 'r') as zip_ref:
                phishing_results = []

                for zipped_file in zip_ref.namelist():
                    with zip_ref.open(zipped_file) as f:
                        content = f.read().decode('utf-8', errors='ignore')
                        result = dummy_predict_phishing(content)
                        phishing_results.append({"file": zipped_file, "result": result})

                if any(r["result"] == "Phishing" for r in phishing_results):
                    final_result = "Phishing"
                elif any(r["result"] == "Suspicious" for r in phishing_results):
                    final_result = "Suspicious"
                else:
                    final_result = "Safe"

                return jsonify({
                    "result": final_result,
                    "details": phishing_results
                })

        return jsonify({"message": f"{filename} uploaded successfully, but no scan performed."}), 200

    return jsonify({"error": "File type not allowed"}), 400

             