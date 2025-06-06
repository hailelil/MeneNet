import bcrypt

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def verify_password(password: str, hashed_password: str) -> bool:
    """Verifies if a password matches its hashed version."""
    return bcrypt.checkpw(password.encode(), hashed_password.encode())

