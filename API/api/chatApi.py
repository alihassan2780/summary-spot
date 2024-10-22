from flask import Blueprint, jsonify, request
import firebase_admin
from firebase_admin import db
import logging

# Create Blueprint for chat routes
chat_api = Blueprint('chat_api', __name__)

@chat_api.route('/history', methods=['GET', 'POST'])
def get_chat_history():
    """Retrieve chat history from Firebase."""
    try:
        if not firebase_admin._apps:
            logging.error("Firebase not initialized. Ensure it is initialized in __init__.py")
            return jsonify({"error": "Firebase not initialized."}), 500

        db_ref = db.reference('/')
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
    except Exception as e:
        logging.exception("An error occurred while fetching chat history.")
        return jsonify({"error": f"Failed to fetch chat history: {str(e)}"}), 500

@chat_api.route('/history', methods=['POST'])
def save_chat():
    """Save a chat message to Firebase."""
    data = request.get_json()

    if not data or not data.get('input') or not data.get('response'):
        logging.warning("Invalid chat data provided.")
        return jsonify({"error": "Invalid data provided."}), 400

    try:
        db_ref = db.reference('/')
        new_chat_ref = db_ref.child('chat_history').push({
            "input": data.get('input'),
            "response": data.get('response')
        })
        logging.info(f"Chat saved successfully with ID: {new_chat_ref.key}")
        return jsonify({"message": "Chat saved successfully", "id": new_chat_ref.key}), 200
    except Exception as e:
        logging.exception("An error occurred while saving chat.")
        return jsonify({"error": f"Failed to save chat: {str(e)}"}), 500
