from flask import Blueprint, request, jsonify
from firebase_admin import firestore, credentials, initialize_app
import uuid
import firebase_admin

# Initialize Firebase if it's not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("/home/ali-hassan/Desktop/SummarySpot/Summerization-Project-1/summarization-bot/API/api/SummarySpot.json")
    initialize_app(cred)

# Initialize Firestore after Firebase is initialized
db = firestore.client()
user_Ref = db.collection("user")

userAPI = Blueprint("userAPI", __name__)

@userAPI.route("/add", methods=["POST"])
def create():
    try:
        # Generate a unique UUID for the user
        id = str(uuid.uuid4())
        user_Ref.document(id).set(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
