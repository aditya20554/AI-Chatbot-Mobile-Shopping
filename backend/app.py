from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import requests
from safety import get_system_prompt
import os

app = Flask(__name__)
CORS(app)

# 1. DATABASE & CONFIG
MODEL_NAME = "gemini-flash-latest"
GOOGLE_API_KEY = "AIzaSyBbB-wWPsRxoXQ7S2AK26BrNO1RpXgIdGU"
GOOGLE_AI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"


## without history
# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.json
#     user_query = data.get("message", "")

#     messages = [
#         {
#             "role": "user", 
#             "parts": [{"text": user_query}]
#         }
#     ]

#     payload = {
#         "system_instruction": {
#             "parts": [{"text": get_system_prompt()}]
#         },
#         "contents": messages,
#         "generationConfig": {
#             "response_mime_type": "application/json",
#             "temperature": 0.1 
#         }
#     }

#     try:
        
#         res = requests.post(
#             f"{GOOGLE_AI_ENDPOINT}?key={GOOGLE_API_KEY}", 
#             json=payload
#         )
        
#         response_data = res.json()

#         # Check for candidates (Safety block or Error)
#         if 'candidates' not in response_data or not response_data['candidates']:
#             # Log the error to your console so you can see why it failed
#             print("API Error Response:", response_data)
#             return jsonify({
#                 "reply": "I couldn't process that. Please try asking about specific phone models or budgets.", 
#                 "intent": "ERROR"
#             })
            
#         ai_json_text = response_data['candidates'][0]['content']['parts'][0]['text']
#         return jsonify(json.loads(ai_json_text))

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify({"reply": "I encountered a system error. Please try again.", "intent": "ERROR"})



## with history
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_query = data.get("message", "")
    # 🔹 Get history from frontend (expected format: [{'sender': 'user', 'text': '...'}, ...])
    history = data.get("history", [])

    # 1. Format the history for Gemini (User -> Model -> User)
    messages = []
    
    # We limit to last 6 turns to keep context relevant and save tokens
    for h in history[-6:]:
        role = "user" if h['sender'] == 'user' else "model"
        # We only send the text content, not the technical JSON arrays
        text_content = h.get('text', "")
        
        if text_content:
            messages.append({
                "role": role, 
                "parts": [{"text": text_content}]
            })

    # 2. Add the current query as the final message
    messages.append({
        "role": "user", 
        "parts": [{"text": user_query}]
    })

    payload = {
        "system_instruction": {
            "parts": [{"text": get_system_prompt()}]
        },
        "contents": messages, # 🔹 Now contains history + current query
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.1 
        }
    }

    try:
        res = requests.post(
            f"{GOOGLE_AI_ENDPOINT}?key={GOOGLE_API_KEY}", 
            json=payload
        )
        
        response_data = res.json()
        print(response_data)
        if 'candidates' not in response_data or not response_data['candidates']:
            print("API Error Response:", response_data)
            return jsonify({
                "reply": "I'm sorry, I encountered a safety block or an error. Please try a different query.", 
                "intent": "ERROR"
            })
            
        ai_json_text = response_data['candidates'][0]['content']['parts'][0]['text']
        return jsonify(json.loads(ai_json_text))

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"reply": "I encountered a system error. Please try again.", "intent": "ERROR"})
    
if __name__ == "__main__":
    # Change this to allow external connections
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=8000, debug=True)