import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database.db_connection import get_db_connection

def add_family_relationship(user_id, related_user_id, relationship_type):
    """
    Adds a family relationship between two users.
    """
    conn = get_db_connection()
    if conn is None:
        raise Exception("Database connection failed.")

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO family_relationships (user_id, related_user_id, relationship_type)
                VALUES (%s, %s, %s);
            """, (user_id, related_user_id, relationship_type))
            conn.commit()
    except Exception as e:
        print(f"Error adding family relationship: {e}")
        raise e
    finally:
        conn.close()