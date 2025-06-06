import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve database credentials with default values if missing
DB_NAME = os.getenv("DB_NAME", "men_db")
DB_USER = os.getenv("DB_USER", "postgres")  # Use postgres for now to avoid 'men_user' error
DB_PASSWORD = os.getenv("DB_PASSWORD", "securepass")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

# Establish database connection with error handling
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()
except psycopg2.OperationalError as e:
    print(f"❌ Database connection failed: {e}")
    raise SystemExit("Check if PostgreSQL is running and DB_USER exists.")

# Define Users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    national_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Define Family Relationships table
cursor.execute("""
CREATE TABLE IF NOT EXISTS family_relationships (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    related_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Define Addresses table
cursor.execute("""
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Define Photos table
cursor.execute("""
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Define Authentication table
cursor.execute("""
CREATE TABLE IF NOT EXISTS authentication (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    hashed_password TEXT NOT NULL,
    auth_method VARCHAR(50)
);
""")

# Define Biometrics table
cursor.execute("""
CREATE TABLE IF NOT EXISTS biometrics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    facial_data BYTEA,
    fingerprint_data BYTEA,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Commit changes and close connection safely
try:
    conn.commit()
    print("✅ All tables created successfully.")
except psycopg2.Error as e:
    print(f"❌ Error committing changes: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()