import os
import io
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['pancreas_app_db']
users_collection = db['users']
history_collection = db['history']

MODEL_PATH = 'pancreas_model.h5'
model = load_model(MODEL_PATH)

def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])
    return doc

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if users_collection.find_one({"username": data['username']}):
        return jsonify({"error": "User already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    users_collection.insert_one({
        "username": data['username'],
        "password": hashed_password
    })
    return jsonify({"message": "User created successfully"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"username": data['username']})
    
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({
            "message": "Login successful", 
            "username": user['username']
        })
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    form_data = request.form
    
    try:
        processed_img = preprocess_image(file.read())
        prediction = model.predict(processed_img)

        confidence = float(prediction[0][0])
        confidence_percent = confidence * 100

        if confidence < 0.5:
            diagnosis = "Benign (No Cancer Detected)"
            cancer_probability = None
            stage = None
            risk_level = "Low"
        else:
            diagnosis = "Malignant (Cancer Detected)"
            cancer_probability = f"{confidence_percent:.2f}%"

            if confidence < 0.6:
                stage = "Stage I (Early)"
            elif confidence < 0.75:
                stage = "Stage II (Moderate)"
            elif confidence < 0.9:
                stage = "Stage III (Advanced)"
            else:
                stage = "Stage IV (Critical)"

            risk_level = "High"

        record = {
            "doctor_username": form_data.get('username'),
            "patient_id": form_data.get('patient_id'),
            "patient_name": form_data.get('name'),
            "age": form_data.get('age'),
            "gender": form_data.get('gender'),

            "diagnosis": diagnosis,
            "model_confidence": f"{confidence_percent:.2f}%",
            "cancer_probability": cancer_probability,
            "stage": stage,
            "risk_level": risk_level,

            "model_used": "ResNet101",
            "disclaimer": "AI-based prediction. Consult a doctor.",

            "scan_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        inserted = history_collection.insert_one(record)
        record['_id'] = str(inserted.inserted_id)

        return jsonify(record)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history/<username>', methods=['GET'])
def get_history(username):
    records = history_collection.find({"doctor_username": username}).sort("scan_date", -1)
    results = [serialize_doc(doc) for doc in records]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)