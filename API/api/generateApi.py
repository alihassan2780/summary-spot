from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
import logging
from .utils import extract_text_from_pdf, generate_response

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

generate_api = Blueprint("generate_api", __name__)

@generate_api.route("/", methods=['GET', 'POST', 'OPTIONS'])
@generate_api.route("", methods=['GET', 'POST', 'OPTIONS'])
def generate():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'CORS preflight OK'}), 200

    user_input = None

    if request.method == 'POST':
        if not request.is_json and 'file' not in request.files:
            logging.warning("Request is neither JSON nor file upload")
            return jsonify({"error": "Request must be JSON or file upload"}), 400

        if 'file' in request.files:
            file = request.files['file']
            if file.filename.endswith('.pdf'):
                user_input = extract_text_from_pdf(file)
                if not user_input:
                    logging.error("Failed to extract text from PDF")
                    return jsonify({"error": "Failed to extract text from PDF"}), 400
            else:
                logging.warning(f"Uploaded file is not a PDF: {file.filename}")
                return jsonify({"error": "File must be a PDF"}), 400
        else:
            data = request.get_json()
            user_input = data.get('prompt')
            if not user_input:
                logging.warning("No prompt found in JSON")
                return jsonify({"error": "No input text provided"}), 400

        try:
            response = generate_response(user_input)
            if response is None:  # Ensure response is not None
                logging.error("Received None response from generate_response")
                return jsonify({"error": "Invalid response generated."}), 500

            logging.info(f"Generated response: {response}")
            return jsonify({"response": response}), 200

        except Exception as e:
            logging.error(f"Error generating response: {e}")
            return jsonify({"error": f"Failed to generate response: {str(e)}"}), 500

    return jsonify({'status': 'OK'}), 200

app.register_blueprint(generate_api, url_prefix='/generate')

