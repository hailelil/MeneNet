# card-generator/app.py

from flask import Flask, request, jsonify, send_from_directory
from utils.pdf_generator import generate_id_card_pdf
import os

app = Flask(__name__)
app.config['CARDS_FOLDER'] = os.path.join(os.getcwd(), 'static/cards')

@app.route('/generate_card', methods=['POST'])
def generate_card():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400

    try:
        # Call PDF generator
        card_filename = generate_id_card_pdf(user_id)
        card_url = f"/static/cards/{card_filename}"

        return jsonify({'card_url': card_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve PDF files
@app.route('/static/cards/<filename>', methods=['GET'])
def download_card(filename):
    return send_from_directory(app.config['CARDS_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs(app.config['CARDS_FOLDER'], exist_ok=True)
    app.run(port=6000, debug=True)