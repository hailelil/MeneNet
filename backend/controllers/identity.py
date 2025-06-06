import uuid
from datetime import datetime

def generate_user_id(region_code: str, dob: str) -> str:
    """
    Generates a unique ID based on region and date of birth.
    Format: REGION-DDMMYY-UNIQUE
    """
    formatted_dob = datetime.strptime(dob, "%Y-%m-%d").strftime("%d%m%y")
    unique_part = str(uuid.uuid4())[:6]  # Generate unique identifier (6 characters)
    return f"{region_code}-{formatted_dob}-{unique_part}"
