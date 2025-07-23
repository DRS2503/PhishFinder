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

@app.route("/about")
def about():
    return """
    <html>
      <head><title>About PhishFinder</title></head>
      <body>
        <h1>About PhishFinder</h1>
        <p>PhishFinder is a machine learning tool that helps detect phishing websites.</p>
        <p>Developed by [Your Name or Team].</p>
        <a href="/">Back to Home</a>
      </body>
    </html>
    """

if __name__ == "__main__":
    app.run(debug=True)
