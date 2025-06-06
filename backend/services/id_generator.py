from controllers.identity import generate_user_id

def generate_id_service(region_code, dob):
    return generate_user_id(region_code, dob)