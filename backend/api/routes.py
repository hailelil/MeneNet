import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, request, jsonify
from database.db_connection import get_db_connection
from security.encryption import hash_password, verify_password
from security.token_manager import generate_token
from controllers.identity import generate_user_id
from controllers.family import add_family_relationship

app = Flask(__name__)

# --- Authentication ---

@app.route("/auth/register", methods=["POST"])
def register_auth():
    data = request.json
    if not data or not data.get("user_id") or not data.get("password"):
        return jsonify({"error": "Missing user_id or password"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    hashed_password = hash_password(data["password"])
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO authentication (user_id, hashed_password, auth_method) VALUES (%s, %s, %s)",
                (data["user_id"], hashed_password, "Password")
            )
            conn.commit()
        return jsonify({"message": "User authentication registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    if not data or not data.get("user_id") or not data.get("password"):
        return jsonify({"error": "Missing user_id or password"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT hashed_password FROM authentication WHERE user_id = %s", (data["user_id"],))
            user = cur.fetchone()

        if user and verify_password(data["password"], user[0]):
            token = generate_token(data["user_id"])
            return jsonify({"token": token}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    finally:
        conn.close()

# --- Identity Management ---

@app.route("/users/register", methods=["POST"])
def register_user():
    data = request.json
    required_fields = ["first_name", "last_name", "date_of_birth", "gender", "region_code"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    user_id = generate_user_id(data["region_code"], data["date_of_birth"])
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO users (first_name, last_name, date_of_birth, gender, national_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (data["first_name"], data["last_name"], data["date_of_birth"], data["gender"], user_id))
            conn.commit()
        return jsonify({"message": "User registered successfully", "national_id": user_id}), 201
    finally:
        conn.close()

@app.route("/users/generate_id", methods=["POST"])
def generate_id():
    data = request.json
    if not data or not data.get("region_code") or not data.get("dob"):
        return jsonify({"error": "Missing region_code or dob"}), 400

    user_id = generate_user_id(data["region_code"], data["dob"])
    return jsonify({"generated_id": user_id}), 200

# --- Family Relationships ---

@app.route("/users/link_family", methods=["POST"])
def link_family():
    data = request.json
    required_fields = ["user_id", "related_user_id", "relationship_type"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        add_family_relationship(data["user_id"], data["related_user_id"], data["relationship_type"])
        return jsonify({"message": "Family relationship added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/relationships/<int:user_id>", methods=["GET"])
def get_family_relationships(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT related_user_id, relationship_type
                FROM family_relationships
                WHERE user_id = %s
            """, (user_id,))
            relationships = cur.fetchall()

            family_list = []
            for rel in relationships:
                family_list.append({
                    "related_user_id": rel[0],
                    "relationship_type": rel[1]
                })

            return jsonify({"user_id": user_id, "family": family_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#/users/search/{national_id} → search user by national_id → used everywhere (frontend, admin, etc.)
@app.route("/users/search/<string:national_id>", methods=["GET"])
def search_user_by_national_id(national_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, first_name, last_name, date_of_birth, gender, national_id
                FROM users
                WHERE national_id = %s
            """, (national_id,))
            user = cur.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404

            user_data = {
                "id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "date_of_birth": str(user[3]),
                "gender": user[4],
                "national_id": user[5]
            }

            return jsonify(user_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#/users/<user_id> → get user profile → useful for UI, admin panel, family relationships
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user_profile(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, first_name, last_name, date_of_birth, gender, national_id
                FROM users
                WHERE id = %s
            """, (user_id,))
            user = cur.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404

            user_data = {
                "id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "date_of_birth": str(user[3]),
                "gender": user[4],
                "national_id": user[5]
            }

            return jsonify(user_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- Run App ---

@app.route("/", methods=["GET"])
def home():
    return "Hello from MeneNet Identity API!", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)