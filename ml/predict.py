import os
import pickle
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import json

app = Flask(__name__)
CORS(app)

ml_dir = "/Users/nithishkumarreddy/Documents/farmer/ml"
datasets_dir = "/Users/nithishkumarreddy/Documents/farmer/datasets"

model = None
encoders = None
df_rain = None
crops_metadata = {}

# New global variables for disease and fertilizer models
disease_model = None
disease_classes = []
fertilizer_model = None
fertilizer_encoders = None


crops_metadata = {
    'Onion': {'duration': 110, 'soils': ['Sandy', 'Loamy', 'Alluvial'], 'investment': 22000, 'volatility': 'Medium', 'harvest_months': [4, 5, 10, 11]},
    'Potato': {'duration': 100, 'soils': ['Loamy', 'Sandy', 'Alluvial'], 'investment': 26000, 'volatility': 'High', 'harvest_months': [1, 2, 3, 11, 12]},
    'Tomato': {'duration': 120, 'soils': ['Loamy', 'Sandy', 'Red'], 'investment': 34000, 'volatility': 'High', 'harvest_months': [1, 2, 6, 7, 8]},
    'Paddy': {'duration': 135, 'soils': ['Clayey', 'Loamy', 'Alluvial'], 'investment': 18000, 'volatility': 'Low', 'harvest_months': [10, 11, 12]},
    'Wheat': {'duration': 130, 'soils': ['Loamy', 'Clayey', 'Alluvial'], 'investment': 14000, 'volatility': 'Low', 'harvest_months': [3, 4, 5]},
    'Cotton': {'duration': 200, 'soils': ['Black', 'Alluvial', 'Red'], 'investment': 28000, 'volatility': 'Medium', 'harvest_months': [10, 11, 12, 1]},
    'Sugarcane': {'duration': 330, 'soils': ['Clayey', 'Black', 'Alluvial'], 'investment': 45000, 'volatility': 'Low', 'harvest_months': [12, 1, 2, 3]},
    'Maize': {'duration': 110, 'soils': ['Loamy', 'Alluvial', 'Red'], 'investment': 13000, 'volatility': 'Medium', 'harvest_months': [9, 10, 11]},
    'Bajra': {'duration': 90, 'soils': ['Sandy', 'Loamy', 'Sandy Loam'], 'investment': 8000, 'volatility': 'High', 'harvest_months': [10, 11]},
    'Barley': {'duration': 120, 'soils': ['Loamy', 'Alluvial'], 'investment': 10000, 'volatility': 'Low', 'harvest_months': [3, 4]},
    'Gram': {'duration': 110, 'soils': ['Clayey', 'Loamy', 'Black'], 'investment': 9000, 'volatility': 'Medium', 'harvest_months': [2, 3, 4]},
    'Groundnut': {'duration': 120, 'soils': ['Sandy', 'Loamy', 'Red'], 'investment': 15000, 'volatility': 'Medium', 'harvest_months': [10, 11, 12]},
    'Sponge Gourd': {'duration': 80, 'soils': ['Sandy', 'Loamy'], 'investment': 12000, 'volatility': 'Medium', 'harvest_months': [5, 6, 7, 8]},
    'Ginger': {'duration': 240, 'soils': ['Sandy', 'Loamy', 'Laterite'], 'investment': 40000, 'volatility': 'High', 'harvest_months': [12, 1, 2]},
    'Peas': {'duration': 90, 'soils': ['Loamy', 'Alluvial', 'Clayey'], 'investment': 16000, 'volatility': 'High', 'harvest_months': [11, 12, 1]},
    'Papaya': {'duration': 300, 'soils': ['Sandy', 'Loamy', 'Alluvial'], 'investment': 35000, 'volatility': 'Medium', 'harvest_months': [2, 3, 4, 5]}
}

crop_mapping = {
    'paddy': 'Paddy', 'rice': 'Paddy', 'wheat': 'Wheat', 'onion': 'Onion',
    'potato': 'Potato', 'tomato': 'Tomato', 'cotton': 'Cotton',
    'sugarcane': 'Sugarcane', 'maize': 'Maize', 'bajra': 'Bajra',
    'barley': 'Barley', 'gram': 'Gram', 'groundnut': 'Groundnut',
    'sponge gourd': 'Sponge Gourd', 'ginger': 'Ginger', 'peas': 'Peas',
    'papaya': 'Papaya'
}

def load_resources():
    global model, encoders, df_rain, disease_model, disease_classes, fertilizer_model, fertilizer_encoders
    
    model_path = os.path.join(ml_dir, "model.pkl")
    encoders_path = os.path.join(ml_dir, "encoders.pkl")
    
    if os.path.exists(model_path) and os.path.exists(encoders_path):
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        with open(encoders_path, "rb") as f:
            encoders = pickle.load(f)
        print("Model and Encoders loaded successfully.")
    else:
        print("WARNING: Model and Encoders not found! Run train.py first.")
        
    rain_path = os.path.join(datasets_dir, "district wise rainfall normal.csv")
    if os.path.exists(rain_path):
        df_rain = pd.read_csv(rain_path)
        df_rain['STATE_UT_NAME'] = df_rain['STATE_UT_NAME'].str.strip().str.upper()
        df_rain['DISTRICT'] = df_rain['DISTRICT'].str.strip().str.upper()
        print("Rainfall dataset loaded successfully.")
    else:
        print("WARNING: Rainfall dataset not found!")

    # Load Plant Disease Model
    disease_model_path = os.path.join(ml_dir, "disease_model.pth")
    disease_classes_path = os.path.join(ml_dir, "disease_classes.json")
    if os.path.exists(disease_model_path) and os.path.exists(disease_classes_path):
        try:
            with open(disease_classes_path, "r") as f:
                disease_classes = json.load(f)["classes"]
            
            num_classes = len(disease_classes)
            disease_model = models.mobilenet_v2(pretrained=False)
            disease_model.classifier = torch.nn.Sequential(
                torch.nn.Dropout(p=0.2),
                torch.nn.Linear(1280, 512),
                torch.nn.ReLU(),
                torch.nn.Dropout(p=0.3),
                torch.nn.Linear(512, 128),
                torch.nn.ReLU(),
                torch.nn.Dropout(p=0.2),
                torch.nn.Linear(128, num_classes)
            )
            disease_model.load_state_dict(torch.load(disease_model_path, map_location=torch.device('cpu')))
            disease_model.eval()
            print("Plant disease PyTorch model loaded successfully.")
        except Exception as e:
            print(f"Error loading disease model: {e}")
    else:
        print("WARNING: Plant disease model or classes file not found yet.")
            
    # Load Fertilizer Model
    fert_model_path = os.path.join(ml_dir, "fertilizer_model.pkl")
    fert_encoders_path = os.path.join(ml_dir, "fertilizer_encoders.pkl")
    if os.path.exists(fert_model_path) and os.path.exists(fert_encoders_path):
        try:
            with open(fert_model_path, "rb") as f:
                fertilizer_model = pickle.load(f)
            with open(fert_encoders_path, "rb") as f:
                fertilizer_encoders = pickle.load(f)
            print("Fertilizer Random Forest model loaded successfully.")
        except Exception as e:
            print(f"Error loading fertilizer model: {e}")
    else:
        print("WARNING: Fertilizer model or encoders file not found yet.")

load_resources()

def get_normal_rainfall(state, district, month_num):
    months_abbr = {
        1: 'JAN', 2: 'FEB', 3: 'MAR', 4: 'APR', 5: 'MAY', 6: 'JUN',
        7: 'JUL', 8: 'AUG', 9: 'SEP', 10: 'OCT', 11: 'NOV', 12: 'DEC'
    }
    col = months_abbr.get(month_num, 'ANNUAL')
    
    if df_rain is None:
        return 100.0
        
    s_upper = str(state).strip().upper()
    d_upper = str(district).strip().upper()
    if s_upper == 'TELANGANA':
        s_upper = 'ANDHRA PRADESH'
    
    res = df_rain[(df_rain['STATE_UT_NAME'] == s_upper) & (df_rain['DISTRICT'] == d_upper)]
    if res.empty:
        res = df_rain[df_rain['DISTRICT'] == d_upper]
    if res.empty:
        res = df_rain[df_rain['STATE_UT_NAME'] == s_upper]
        
    if not res.empty:
        return float(res[col].mean())
    else:
        return 100.0

@app.route('/crops', methods=['GET'])
def list_crops():
    return jsonify({
        'status': 'ok',
        'crops': list(crops_metadata.keys())
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or encoders is None:
        return jsonify({
            'status': 'error',
            'message': 'Model is not trained. Please run training first.'
        }), 500
        
    data = request.json or {}
    crop_input = data.get('crop', '').strip()
    state = data.get('state', '').strip()
    district = data.get('district', '').strip()
    soil_type = data.get('soil_type', '').strip()
    planting_date_str = data.get('planting_date', '').strip()
    
    # New tomorrow/target date prediction parameters
    target_date_str = data.get('target_date', '').strip()
    stock_level = data.get('stock_level', '').strip()       # Low, Medium, High
    weather_condition = data.get('weather_condition', '').strip() # Sunny, Rainy, Normal
    
    # Standardize crop name
    crop_standard = crop_mapping.get(crop_input.lower(), crop_input)
    if crop_standard not in crops_metadata:
        matches = [c for c in encoders['crops_list'] if crop_input.lower() in c.lower()]
        crop_standard = matches[0] if matches else 'Onion'
            
    crop_meta = crops_metadata.get(crop_standard, {'duration': 120, 'soils': ['Loamy'], 'investment': 15000, 'volatility': 'Medium', 'harvest_months': [5, 10]})
    duration = crop_meta['duration']
    
    # Parse sowing & prediction target dates
    try:
        planting_date = datetime.strptime(planting_date_str, '%Y-%m-%d')
    except Exception:
        planting_date = datetime.now()
        
    completion_date = planting_date + timedelta(days=duration)
    
    # If the user specifies a specific target date to predict for (e.g. tomorrow)
    if target_date_str:
        try:
            prediction_target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
        except Exception:
            prediction_target_date = completion_date
    else:
        prediction_target_date = completion_date
        
    pred_month = prediction_target_date.month
    pred_year = prediction_target_date.year
    
    # Get base rainfall feature and adjust according to weather condition parameter
    normal_rainfall = get_normal_rainfall(state, district, pred_month)
    if weather_condition == 'Rainy':
        rainfall_val = normal_rainfall * 1.45  # High rain volume
    elif weather_condition == 'Sunny':
        rainfall_val = normal_rainfall * 0.55  # Lower dry season rain
    else:
        rainfall_val = normal_rainfall
        
    # Map stock level parameter to numeric Tonnes
    if stock_level == 'High':
        stock_tonnes = 950.0
    elif stock_level == 'Medium':
        stock_tonnes = 480.0
    elif stock_level == 'Low':
        stock_tonnes = 120.0
    else:
        # Auto-compute stock based on harvest season
        peaks = crop_meta['harvest_months']
        if pred_month in peaks:
            stock_tonnes = 950.0
            stock_level = 'High'
        elif any(abs(pred_month - p) == 1 for p in peaks):
            stock_tonnes = 480.0
            stock_level = 'Medium'
        else:
            stock_tonnes = 120.0
            stock_level = 'Low'

    try:
        crop_encoded = encoders['le_crop'].transform([crop_standard])[0]
    except Exception:
        crop_encoded = 0
        
    # Model prediction features: ['Crop_Encoded', 'Month', 'Rainfall', 'Year', 'Stock']
    features = np.array([[crop_encoded, pred_month, rainfall_val, pred_year, stock_tonnes]])
    
    try:
        # Load resources if model was updated
        if model is None:
            load_resources()
        predicted_price_raw = model.predict(features)[0]
    except Exception as e:
        # Heuristic fallback based on stock level (high supply lowers price)
        stock_factor = 0.8 if stock_level == 'High' else (1.2 if stock_level == 'Low' else 1.0)
        predicted_price_raw = (crop_meta['investment'] / 1000.0) * 1.5 * stock_factor
        
    predicted_price = max(1.5, float(predicted_price_raw))
    
    # Apply explicit price elasticity of supply/demand to align with market dynamics
    if stock_level == 'High':
        predicted_price *= 0.82  # High supply lowers price by 18%
    elif stock_level == 'Low':
        predicted_price *= 1.18  # Low supply increases price by 18%
    elif stock_level == 'Medium':
        predicted_price *= 1.0  # Medium supply maintains baseline price
        
    predicted_price = round(predicted_price, 2)
    
    # Soil Suitability Risk
    soil_risk = 0.0
    if soil_type:
        suitable_soils = [s.lower() for s in crop_meta['soils']]
        if soil_type.lower() not in suitable_soils:
            soil_risk = 0.7
            
    # Weather Precipitation Risk
    weather_risk = 0.0
    if crop_standard in ['Bajra', 'Barley', 'Gram', 'Groundnut']:
        if rainfall_val > 200.0:
            weather_risk = 0.7
    elif crop_standard in ['Paddy', 'Sugarcane']:
        if rainfall_val < 100.0:
            weather_risk = 0.8
            
    # Volatility
    vola_risk_map = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8}
    price_risk = vola_risk_map.get(crop_meta['volatility'], 0.5)
    
    # Market supply risk: High stock is low risk for consumers but high price-crash risk for farmers
    stock_risk = 0.7 if stock_level == 'High' else 0.2
    
    # Combined risk assessment
    avg_risk_val = (soil_risk * 0.25) + (weather_risk * 0.3) + (price_risk * 0.25) + (stock_risk * 0.20)
    risk_level = 'Low' if avg_risk_val < 0.35 else ('Medium' if avg_risk_val < 0.65 else 'High')
        
    # Economics estimation
    recommended_yield = float(np.random.normal(loc=15.0, scale=3.0)) 
    recommended_yield = max(5.0, round(recommended_yield, 2))
    expected_revenue = round(recommended_yield * 100.0 * predicted_price, 2)
    net_profit = round(expected_revenue - crop_meta['investment'], 2)
    roi = round((net_profit / crop_meta['investment']) * 100.0, 1)
    
    return jsonify({
        'status': 'ok',
        'crop': crop_standard,
        'soil_type': soil_type,
        'state': state,
        'district': district,
        'planting_date': planting_date.strftime('%Y-%m-%d'),
        'completion_date': completion_date.strftime('%Y-%m-%d'),
        'target_prediction_date': prediction_target_date.strftime('%Y-%m-%d'),
        'duration_days': duration,
        'normal_rainfall_mm': round(normal_rainfall, 2),
        'simulated_rainfall_mm': round(rainfall_val, 2),
        'market_stock_level': stock_level,
        'market_stock_tonnes': round(stock_tonnes, 1),
        'weather_condition': weather_condition or 'Normal',
        'predicted_price_rs_kg': round(predicted_price, 2),
        'predicted_price_rs_quintal': round(predicted_price * 100.0, 2),
        'risk_level': risk_level,
        'risk_breakdown': {
            'soil_suitability_risk': 'High' if soil_risk > 0.5 else 'Low',
            'weather_precipitation_risk': 'High' if weather_risk > 0.5 else ('Medium' if weather_risk > 0.2 else 'Low'),
            'market_price_volatility': crop_meta['volatility'],
            'market_supply_saturation': 'High (Price Crash Warning)' if stock_level == 'High' else 'Low (Stable)'
        },
        'economics_per_acre': {
            'estimated_investment_inr': crop_meta['investment'],
            'estimated_yield_quintals': recommended_yield,
            'estimated_revenue_inr': expected_revenue,
            'net_profit_inr': net_profit,
            'roi_percentage': roi
        },
        'agronomic_tips': get_agronomic_tips(crop_standard, soil_type, rainfall_val, stock_level)
    })

def get_agronomic_tips(crop, soil, rainfall, stock):
    tips = []
    if crop == 'Paddy':
        tips.append("Paddy requires standing water. Ensure proper bunding in fields to retain water.")
        if rainfall < 120:
            tips.append("Rainfall is predicted to be lower than normal. Arrange auxiliary canal or tubewell irrigation.")
    elif crop == 'Cotton':
        tips.append("Cotton is highly susceptible to water-logging. Ensure excellent drainage fields.")
        tips.append("Watch out for Pink Bollworm infestations. Use pheromone traps early on.")
    elif crop == 'Onion':
        tips.append("Onions require rich, loose sandy-loam soils. Avoid planting in waterlogged soils.")
        tips.append("Harvest when 50% of the crop foliage falls over naturally.")
    else:
        tips.append(f"Ensure soil is well-prepared with organic compost before planting {crop}.")
        tips.append("Follow standard weeding cycles at 20 and 45 days after sowing.")
        
    if stock == 'High':
        tips.append("WARNING: High stock volume in markets may cause prices to drop. Consider warehousing or cold storing your harvest to sell later during off-season prices.")
    elif stock == 'Low':
        tips.append("MARKET OPPORTUNITY: Low stock volume in markets indicates high demand. Sell your harvest immediately to secure premium prices.")
        
    return tips

# Image transform for disease prediction
disease_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/predict-disease', methods=['POST'])
def predict_disease():
    global disease_model, disease_classes
    
    if disease_model is None:
        load_resources()
        if disease_model is None:
            return jsonify({
                'status': 'error',
                'message': 'Plant disease model is not loaded.'
            }), 500
            
    data = request.json or {}
    image_base64 = data.get('image', '')
    if not image_base64:
        return jsonify({
            'status': 'error',
            'message': 'No image data provided.'
        }), 400
        
    try:
        # Strip data URI prefix if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
            
        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Apply transformation
        img_tensor = disease_transform(image).unsqueeze(0)
        
        with torch.no_grad():
            outputs = disease_model(img_tensor)
            _, predicted = outputs.max(1)
            class_idx = predicted.item()
            predicted_class = disease_classes[class_idx]
            
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence = float(probabilities[0][class_idx].item())
            
        return jsonify({
            'status': 'ok',
            'disease': predicted_class,
            'confidence': round(confidence, 4)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Inference failed: {str(e)}'
        }), 500

@app.route('/predict-fertilizer', methods=['POST'])
def predict_fertilizer():
    global fertilizer_model, fertilizer_encoders
    
    if fertilizer_model is None or fertilizer_encoders is None:
        load_resources()
        if fertilizer_model is None or fertilizer_encoders is None:
            return jsonify({
                'status': 'error',
                'message': 'Fertilizer model is not loaded.'
            }), 500
            
    data = request.json or {}
    try:
        temp = float(data.get('temperature', 28.0))
        hum = float(data.get('humidity', 60.0))
        moist = float(data.get('moisture', 40.0))
        soil_type = data.get('soil_type', '').strip()
        crop_type = data.get('crop_type', '').strip()
        n = float(data.get('nitrogen', 20.0))
        k = float(data.get('potassium', 20.0))
        p = float(data.get('phosphorous', 20.0))
        
        try:
            soil_encoded = fertilizer_encoders['le_soil'].transform([soil_type])[0]
        except Exception:
            soil_encoded = 0
            
        try:
            crop_encoded = fertilizer_encoders['le_crop'].transform([crop_type])[0]
        except Exception:
            crop_encoded = 0
            
        features = [[temp, hum, moist, soil_encoded, crop_encoded, n, k, p]]
        pred_idx = fertilizer_model.predict(features)[0]
        predicted_fertilizer = fertilizer_encoders['le_fertilizer'].inverse_transform([pred_idx])[0]
        
        return jsonify({
            'status': 'ok',
            'fertilizer': predicted_fertilizer
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Prediction failed: {str(e)}'
        }), 500

if __name__ == "__main__":
    load_resources()
    app.run(host='0.0.0.0', port=5000, debug=False)
