import sys
import os
import psycopg2
from flask import Flask, request, jsonify

# Ensure Python recognizes backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import security modules correctly
from security.encryption import hash_password, verify_password
from security.token_manager import generate_token
from controllers.identity import generate_user_id  # NEW: Import ID generation function

app = Flask(__name__)

# Load environment variables
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")

# Establish database connection
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST
    )
except Exception as e:
    print(f"Database connection error: {e}")

@app.route("/auth/register", methods=["POST"])
def register():
    """Registers a user for authentication"""
    data = request.json
    hashed_password = hash_password(data["password"])

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO authentication (user_id, hashed_password, auth_method) VALUES (%s, %s, %s)",
        (data["user_id"], hashed_password, "Password")
    )
    conn.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    """Handles user authentication"""
    data = request.json
    cur = conn.cursor()
    cur.execute("SELECT hashed_password FROM authentication WHERE user_id = %s", (data["user_id"],))
    user = cur.fetchone()

    if user and verify_password(data["password"], user[0]):
        token = generate_token(data["user_id"])
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/users/register", methods=["POST"])
def register_user():
    """Registers a new user and generates a unique ID"""
    data = request.json
    user_id = generate_user_id(data["region_code"], data["date_of_birth"])

    cur = conn.cursor()
    cur.execute("""
        INSERT INTO users (first_name, last_name, date_of_birth, gender, national_id)
        VALUES (%s, %s, %s, %s, %s)
    """, (data["first_name"], data["last_name"], data["date_of_birth"], data["gender"], user_id))

    conn.commit()
    return jsonify({"message": "User registered successfully", "national_id": user_id}), 201

if __name__ == "__main__":
    app.run(debug=True)
