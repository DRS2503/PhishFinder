from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# register routes
from app.routes.upload_route import upload_blueprint
app.register_blueprint(upload_blueprint)

@app.route("/")
def index():
    return "PhishFinder backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
