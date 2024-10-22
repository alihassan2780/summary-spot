from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import PyPDF2
import pytesseract
from pdf2image import convert_from_path
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

db_ref = None
try:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": "project-scp-096",
        "private_key_id": "5f6e4d27efe5dc13e5ead470147a6dc225db6f50",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCt7L8KYXXz32mE\n...",
        "client_email": "firebase-adminsdk-ozaar@project-scp-096.iam.gserviceaccount.com",
        "client_id": "102124936426434591770",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ozaar%40project-scp-096.iam.gserviceaccount.com"
    })
    firebase_admin.initialize_app(cred, {'databaseURL': "https://project-scp-096-default-rtdb.europe-west1.firebasedatabase.app/"})
    db_ref = db.reference('/')
    print("Firebase initialized successfully!")
except Exception as e:
    logging.error(f"Error initializing Firebase: {e}")

logging.basicConfig(level=logging.INFO)

# Set environment variable for Gemini API key
os.environ["GEMINI_API_KEY"] = "AIzaSyAP_zPIvFvc3e4sULxqi0CcvhF-g-koeQU"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

template = """Your document/text: {text}

Please summarize the above text in a clear and concise manner, using bullet points where applicable. 
Each bullet point should capture the main ideas or key points from the text. 
Ensure that the summary is well-structured and easy to read.

Summarized text:"""

prompt = PromptTemplate(template=template, input_variables=["text"])

llm = ChatGoogleGenerativeAI(
    api_key=GEMINI_API_KEY,
    model="gemini-1.5-pro",
    model_kwargs={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain"
    }
)

llmchain = LLMChain(prompt=prompt, llm=llm)

def generate_response(input_text):
    """Generates a summary response using LangChain and the Gemini model."""
    try:
        response = llmchain.run({"text": input_text})
        return response
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        return "An error occurred while generating the response. Please try again."

def extract_text_from_pdf(file):
    """Extracts text from a PDF file, using OCR if necessary."""
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        page_text = page.extract_text()

        if not page_text:
            logging.info(f"Page {page_num + 1}: No text found, using OCR.")
            images = convert_from_path(
                file, first_page=page_num + 1, last_page=page_num + 1
            )
            if images:
                page_text = pytesseract.image_to_string(images[0])

        text += (page_text if page_text else "") + "\n"

    return text.strip()

# --- Flask Routes ---
@app.route("/generate", methods=["POST"])
def generate():
    """Endpoint to generate summaries from user input or uploaded PDF files."""
    global db_ref  # Ensure access to db_ref

    if not request.is_json and 'file' not in request.files:
        logging.warning("Request is neither JSON nor file upload")
        return jsonify({"error": "Request must be JSON or file upload"}), 400

    user_input = None

    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file)
            logging.info(f"Extracted text length: {len(extracted_text)}")
            user_input = extracted_text
        else:
            return jsonify({"error": "File must be a PDF"}), 400
    else:
        data = request.get_json()
        user_input = data.get('prompt')

    if not user_input:
        logging.warning("No input text provided")
        return jsonify({"error": "No input text provided"}), 400

    try:
        logging.info(f"Received user input: {user_input}")
        response = generate_response(user_input)
        logging.info(f"Generated response: {response}")

        # --- Save to Firebase (with check for successful initialization) ---
        if db_ref is not None:
            try:
                test_data = {"test_key": "test_value"}
                db_ref.child('test_write').set(test_data)
                logging.info("Test write to Firebase successful!")
            except Exception as e:
                logging.error(f"Error writing to database: {e}")
        else:
            logging.error("Firebase not initialized, cannot write to database.")

        return jsonify({"response": response}), 200
    except Exception as e:
        logging.exception("An error occurred while generating a response")
        return jsonify({"error": f"Failed to generate response: {str(e)}"}), 500

@app.route("/chat_history", methods=["GET"])
def get_chat_history():
    """Endpoint to retrieve chat history from Firebase."""
    global db_ref  # Ensure access to db_ref

    try:
        if db_ref is not None:
            chat_history = db_ref.child('chat_history').get()
            formatted_history = []
            if chat_history:
                for key, value in chat_history.items():
                    formatted_history.append({
                        "id": key,
                        "input": value.get("input"),
                        "response": value.get("response")
                    })
            return jsonify(formatted_history), 200
        else:
            logging.error("Could not fetch chat history. Database not initialized.")
            return jsonify({"error": "Failed to fetch chat history."}), 500
    except Exception as e:
        logging.exception("An error occurred while fetching chat history")
        return jsonify({"error": f"Failed to fetch chat history: {str(e)}"}), 500

# --- Run the App ---
if __name__ == "__main__":
    app.run(debug=True, port=5004)
