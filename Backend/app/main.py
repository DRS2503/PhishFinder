from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# register routes
from routes.upload_route import upload_blueprint
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
            <p>PhishFinder is a machine learning tool that helps detect phishing emails.</p>
            <p>Developed by [Alexander DiCicco, Derek Schramm, Matthew Kajdasz, Lucas Hermiz].</p>
            <a href="/">Back to Home</a>
          </body>
        </html>
        """

if __name__ == "__main__":
    app.run(debug=True)
