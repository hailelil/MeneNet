import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, request, jsonify, send_from_directory
from database.db_connection import get_db_connection
from security.encryption import hash_password, verify_password
from security.token_manager import generate_token
from controllers.identity import generate_user_id
from controllers.family import add_family_relationship
from flask_cors import CORS

import uuid
from werkzeug.utils import secure_filename


app = Flask(__name__)
CORS(app)

# Reverse relashionship
REVERSE_RELATIONSHIPS = {
    'Parent': 'Child',
    'Child': 'Parent',
    'Sibling': 'Sibling',
    'Spouse': 'Spouse',
    'Grandparent': 'Grandchild',
    'Grandchild': 'Grandparent'
}


@app.route('/static/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'), filename)

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

    user_id = data["user_id"]
    related_user_id = data["related_user_id"]
    relationship_type = data["relationship_type"]
    reverse_relationship_type = REVERSE_RELATIONSHIPS.get(relationship_type, relationship_type)  # fallback to same

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            # Insert original relationship
            cur.execute("""
                INSERT INTO family_relationships (user_id, related_user_id, relationship_type)
                VALUES (%s, %s, %s)
            """, (user_id, related_user_id, relationship_type))

            # Insert reverse relationship
            cur.execute("""
                INSERT INTO family_relationships (user_id, related_user_id, relationship_type)
                VALUES (%s, %s, %s)
            """, (related_user_id, user_id, reverse_relationship_type))

            conn.commit()

        return jsonify({"message": "Family relationship added successfully (both directions)"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

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

# --- user search ---- 

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

'''
    ---- This is Addresses management -----
'''
#Adresess routing 
@app.route("/addresses", methods=["POST"])
def add_address():
    data = request.json
    required_fields = ["user_id", "street", "city", "state", "country", "postal_code"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO addresses (user_id, street, city, state, country, postal_code)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (data["user_id"], data["street"], data["city"], data["state"], data["country"], data["postal_code"]))
            conn.commit()
        return jsonify({"message": "Address added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#get all adresses for a user 
@app.route("/addresses/<int:user_id>", methods=["GET"])
def get_addresses(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, street, city, state, country, postal_code
                FROM addresses
                WHERE user_id = %s
            """, (user_id,))
            addresses = cur.fetchall()

            address_list = []
            for addr in addresses:
                address_list.append({
                    "id": addr[0],
                    "street": addr[1],
                    "city": addr[2],
                    "state": addr[3],
                    "country": addr[4],
                    "postal_code": addr[5]
                })

            return jsonify({"user_id": user_id, "addresses": address_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#Update address
@app.route("/addresses/<int:address_id>", methods=["PUT"])
def update_address(address_id):
    data = request.json
    required_fields = ["street", "city", "state", "country", "postal_code"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE addresses
                SET street = %s, city = %s, state = %s, country = %s, postal_code = %s
                WHERE id = %s
            """, (data["street"], data["city"], data["state"], data["country"], data["postal_code"], address_id))
            conn.commit()
        return jsonify({"message": "Address updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#Delete Address
@app.route("/addresses/<int:address_id>", methods=["DELETE"])
def delete_address(address_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM addresses WHERE id = %s", (address_id,))
            conn.commit()
        return jsonify({"message": "Address deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

'''
     ------ Photo Management -------
'''
# -- upload profile photo
@app.route("/photos/upload", methods=["POST"])
def upload_photo():
    user_id = request.form.get("user_id")
    image_file = request.files.get("image_file")

    if not user_id or not image_file:
        return jsonify({"error": "Missing user_id or image_file"}), 400

    # Save file to static/images/
    filename = secure_filename(image_file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    save_path = os.path.join(os.path.dirname(__file__), "..", "static", "images", unique_filename)
    image_file.save(save_path)

    # Store in DB
    image_url = f"/static/images/{unique_filename}"

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO photos (user_id, image_url)
                VALUES (%s, %s)
            """, (user_id, image_url))
            conn.commit()
        return jsonify({"message": "Photo uploaded successfully", "image_url": image_url}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#retrive profile photo
@app.route("/photos/<int:user_id>", methods=["GET"])
def get_user_photo(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT image_url
                FROM photos
                WHERE user_id = %s
                ORDER BY uploaded_at DESC
                LIMIT 1
            """, (user_id,))
            photo = cur.fetchone()

            if not photo:
                return jsonify({"error": "Photo not found"}), 404

            return jsonify({"user_id": user_id, "image_url": photo[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

'''
    ------- Biometrics data -------
'''
# upload Biometrics  Upload biometrics (future AI-ready)
@app.route("/biometrics", methods=["POST"])
def upload_biometrics():
    user_id = request.form.get("user_id")
    facial_data_file = request.files.get("facial_data")
    fingerprint_data_file = request.files.get("fingerprint_data")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # For now → we just store raw files in DB → later you will add AI processing
    facial_data = facial_data_file.read() if facial_data_file else None
    fingerprint_data = fingerprint_data_file.read() if fingerprint_data_file else None

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO biometrics (user_id, facial_data, fingerprint_data)
                VALUES (%s, %s, %s)
            """, (user_id, facial_data, fingerprint_data))
            conn.commit()
        return jsonify({"message": "Biometric data uploaded successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


#List all user 
@app.route("/users", methods=["GET"])
def list_users():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, first_name, last_name, date_of_birth, gender, national_id
                FROM users
                ORDER BY created_at DESC
            """)
            users = cur.fetchall()

            user_list = []
            for user in users:
                user_list.append({
                    "id": user[0],
                    "first_name": user[1],
                    "last_name": user[2],
                    "date_of_birth": str(user[3]),
                    "gender": user[4],
                    "national_id": user[5]
                })

            return jsonify({"users": user_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
     
#add default password 
@app.route("/auth/update_password", methods=["POST"])
def update_password():
    data = request.json
    required_fields = ["user_id", "old_password", "new_password"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            # Fetch current hashed password
            cur.execute("SELECT hashed_password FROM authentication WHERE user_id = %s", (data["user_id"],))
            user = cur.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404

            current_hashed_password = user[0]

            # Verify old password
            if not verify_password(data["old_password"], current_hashed_password):
                return jsonify({"error": "Incorrect current password"}), 401

            # Hash new password
            new_hashed_password = hash_password(data["new_password"])

            # Update password
            cur.execute("""
                UPDATE authentication SET hashed_password = %s WHERE user_id = %s
            """, (new_hashed_password, data["user_id"]))

            conn.commit()

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# -- users search -- 
@app.route("/users/search", methods=["GET"])
def search_users():
    q = request.args.get("q", "")

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, first_name, last_name, date_of_birth, gender, national_id
                FROM users
                WHERE first_name ILIKE %s
                OR last_name ILIKE %s
                OR national_id ILIKE %s
            """, (f"%{q}%", f"%{q}%", f"%{q}%"))

            users = cur.fetchall()

            user_list = []
            for u in users:
                user_list.append({
                    "id": u[0],
                    "first_name": u[1],
                    "last_name": u[2],
                    "date_of_birth": u[3].strftime("%Y-%m-%d"),
                    "gender": u[4],
                    "national_id": u[5]
                })

            return jsonify({"users": user_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/users/by_national_id/<string:national_id>", methods=["GET"])
def get_user_by_national_id(national_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, first_name, last_name, national_id
                FROM users
                WHERE national_id = %s
            """, (national_id,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404

            return jsonify({
                "id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "national_id": user[3]
            }), 200
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