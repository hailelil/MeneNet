# card-generator/utils/pdf_generator.py

from reportlab.lib.pagesizes import landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import os
import qrcode
from PIL import Image

# Define ID-1 size manually → 85.60 mm × 53.98 mm
ID_1 = (85.60 * mm, 53.98 * mm)

def generate_id_card_pdf(user_id):
    # TODO → Replace this with actual DB query to fetch user data!
    user_data = {
        'first_name': 'John',
        'last_name': 'Doe',
        'national_id': 'AA-123456',
        'dob': '1990-01-01',
        'gender': 'Male',
        'address': 'Addis Ababa, Ethiopia',
        'issued_date': '2025-06-09',
        'expiration_date': '2030-06-09',
        'profile_photo': 'static/images/default_photo.jpg'  # Replace with real photo path if available
    }

    # Create PDF → ID card size → we use landscape A4 for this example (can adjust)
    card_width, card_height = landscape(ID_1)  # ISO ID-1 format → like driver’s license
    filename = f"user_{user_id}_card.pdf"
    file_path = os.path.join('static/cards', filename)

    c = canvas.Canvas(file_path, pagesize=(card_width, card_height))

    #### FRONT PAGE ####

    # Draw logo
    c.drawImage("static/images/logo.png", 10 * mm, card_height - 25 * mm, width=20 * mm, height=20 * mm)

    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(35 * mm, card_height - 20 * mm, "MeneNet Identity Card")

    # Profile Photo
    c.drawImage(user_data['profile_photo'], 10 * mm, card_height - 65 * mm, width=30 * mm, height=30 * mm)

    # Text Fields
    c.setFont("Helvetica", 10)
    text_x = 45 * mm
    text_y_start = card_height - 35 * mm
    line_height = 6 * mm

    c.drawString(text_x, text_y_start, f"Name: {user_data['first_name']} {user_data['last_name']}")
    c.drawString(text_x, text_y_start - line_height, f"National ID: {user_data['national_id']}")
    c.drawString(text_x, text_y_start - 2 * line_height, f"DOB: {user_data['dob']}")
    c.drawString(text_x, text_y_start - 3 * line_height, f"Gender: {user_data['gender']}")
    c.drawString(text_x, text_y_start - 4 * line_height, f"Address: {user_data['address']}")
    c.drawString(text_x, text_y_start - 5 * line_height, f"Issued: {user_data['issued_date']}")
    c.drawString(text_x, text_y_start - 6 * line_height, f"Expires: {user_data['expiration_date']}")

    c.showPage()

    #### BACK PAGE ####

    # Generate QR code
    qr_url = f"https://your-system.com/verify/{user_data['national_id']}"
    qr_img = qrcode.make(qr_url)
    qr_img_path = f"static/cards/qr_user_{user_id}.png"
    qr_img.save(qr_img_path)

    # Draw QR code
    c.drawImage(qr_img_path, 10 * mm, card_height - 55 * mm, width=40 * mm, height=40 * mm)

    # Issuing Authority + Signature
    c.setFont("Helvetica-Bold", 12)
    c.drawString(55 * mm, card_height - 20 * mm, "Issuing Authority: MeneNet Authority")

    c.drawImage("static/images/signature.png", 55 * mm, card_height - 50 * mm, width=40 * mm, height=15 * mm)

    # Timestamp
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    c.setFont("Helvetica", 10)
    c.drawString(10 * mm, 10 * mm, f"Generated on: {timestamp}")

    # Terms (optional)
    c.setFont("Helvetica", 8)
    c.drawString(10 * mm, 5 * mm, "This identity card is property of MeneNet Authority.")

    c.showPage()

    # Save PDF
    c.save()

    # Clean up temporary QR code image
    os.remove(qr_img_path)

    return filename