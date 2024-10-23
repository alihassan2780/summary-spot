from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
from .chatApi import chat_api
from .generateApi import generate_api
from .userApi import userAPI  # Ensure user_api is imported
import os
import logging
    
def create_app():
    app = Flask(__name__)
    
    # Setup CORS to allow requests from frontend
    CORS(app, supports_credentials=True, resources={r"/generate/*": {"origins": "*"}})
    
    # Logging setup
    logging.basicConfig(level=logging.INFO)

    # Initialize Firebase if not already initialized
    if not firebase_admin._apps:  # Check if Firebase app is already initialized
        try:
            cred_path = os.getenv("FIREBASE_CREDENTIALS", 
                "/home/ali-hassan/Desktop/SummarySpot/Summerization-Project-1/summarization-bot/API/api/SummarySpot.json")
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'databaseURL': "https://summaryspot12-default-rtdb.europe-west1.firebasedatabase.app/"
            })
            logging.info("Firebase initialized successfully!")
        except Exception as e:
            logging.error(f"Error initializing Firebase: {e}")

    # Register Blueprints for different APIs
    app.register_blueprint(chat_api, url_prefix="/chat")
    app.register_blueprint(generate_api, url_prefix="/generate")
    app.register_blueprint(userAPI, url_prefix='/user')  # Ensure user_api is registered

    return app
