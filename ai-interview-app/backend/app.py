from flask import Flask
from flask_cors import CORS
from routes.routes import main
from models.db import init_db

app = Flask(__name__)
CORS(app)

# Initialize DB
init_db()

# Register blueprint
app.register_blueprint(main)

if __name__ == "__main__":
    app.run(debug=True)