import zipfile
import os
import email
import joblib
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

upload_blueprint = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"csv", "zip", "txt", "eml"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

model_path = os.path.join(os.path.dirname(__file__), '../ml_pipeline/models/best_model.pkl')
vectorizer_path = os.path.join(os.path.dirname(__file__), '../ml_pipeline/models/vectorizer.pkl')

try:
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    print("✅ ML models loaded successfully")
except Exception as e:
    print(f"⚠️ Failed to load ML models: {e}")
    model = None
    vectorizer = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_email_content(file_path):
    """Extract text content from .eml files"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            msg = email.message_from_file(f)
        
        # Get email body
        if msg.is_multipart():
            body = ""
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    body += part.get_payload(decode=True).decode('utf-8', errors='ignore')
        else:
            body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
        
        subject = msg.get('Subject', '')
        return f"{subject} {body}"
    except:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()

def predict_phishing(text):
    """Use real ML model for phishing detection"""
    if model and vectorizer and text.strip():
        try:
            text_vectorized = vectorizer.transform([text])
            prediction = model.predict(text_vectorized)[0]
            confidence = model.predict_proba(text_vectorized)[0].max()
            
            result = "Phishing" if prediction == 1 else "Safe"
            return {"result": result, "confidence": f"{confidence:.1%}"}
        except Exception as e:
            print(f"Model prediction error: {e}")
            return {"result": "Error", "confidence": "N/A"}
    else:
        return {"result": "Safe", "confidence": "N/A"}

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
            if filename.endswith("zip"):
                with zipfile.ZipFile(save_path, 'r') as zip_ref:
                    phishing_results = []

                    for zipped_file in zip_ref.namelist():
                        with zip_ref.open(zipped_file) as f:
                            content = f.read().decode('utf-8', errors='ignore')
                            result = predict_phishing(content)
                            phishing_results.append({
                                "file": zipped_file, 
                                "result": result["result"],
                                "confidence": result["confidence"]
                            })

                    if any(r["result"] == "Phishing" for r in phishing_results):
                        final_result = "Phishing"
                    else:
                        final_result = "Safe"

                    return jsonify({
                        "filename": filename,
                        "result": final_result,
                        "details": phishing_results,
                        "message": "ZIP file analyzed successfully"
                    })
            else:
                if filename.endswith('.eml'):
                    content = extract_email_content(save_path)
                else:
                    with open(save_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                # Use real ML model for prediction
                result = predict_phishing(content)
                
                return jsonify({
                    "filename": filename,
                    "result": result["result"],
                    "confidence": result["confidence"],
                    "message": "File analyzed successfully"
                })
        finally:
            if os.path.exists(save_path):
                os.remove(save_path)

    return jsonify({"error": "File type not allowed"}), 400

             
