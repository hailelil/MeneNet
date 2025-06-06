import uuid
from datetime import datetime
import random
import string

def generate_user_id(region_code: str, dob: str) -> str:
    formatted_dob = datetime.strptime(dob, "%Y-%m-%d").strftime("%d%m%y")
    unique_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{region_code}-{formatted_dob}-{unique_part}"