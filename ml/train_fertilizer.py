import os
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

datasets_dir = "/Users/nithishkumarreddy/Documents/farmer/datasets"
output_dir = "/Users/nithishkumarreddy/Documents/farmer/ml"
os.makedirs(output_dir, exist_ok=True)

def train_fertilizer():
    csv_path = os.path.join(datasets_dir, "Fertilizer Prediction.csv")
    if not os.path.exists(csv_path):
        print(f"ERROR: Dataset not found at {csv_path}")
        return
        
    print("Loading Fertilizer Prediction CSV...")
    df = pd.read_csv(csv_path)
    
    # Strip spaces from column names
    df.columns = df.columns.str.strip()
    
    # Rename Temparature to Temperature if misspelled
    if 'Temparature' in df.columns:
        df = df.rename(columns={'Temparature': 'Temperature'})
        
    print("Columns:", df.columns.tolist())
    
    # Fit LabelEncoders
    le_soil = LabelEncoder()
    df['Soil Type_Encoded'] = le_soil.fit_transform(df['Soil Type'])
    
    le_crop = LabelEncoder()
    df['Crop Type_Encoded'] = le_crop.fit_transform(df['Crop Type'])
    
    le_fertilizer = LabelEncoder()
    df['Fertilizer_Encoded'] = le_fertilizer.fit_transform(df['Fertilizer Name'])
    
    # Split features and label
    features_cols = ['Temperature', 'Humidity', 'Moisture', 'Soil Type_Encoded', 'Crop Type_Encoded', 'Nitrogen', 'Potassium', 'Phosphorous']
    X = df[features_cols]
    y = df['Fertilizer_Encoded']
    
    print(f"Training Random Forest Classifier on {len(df)} samples...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X, y)
    
    train_score = model.score(X, y)
    print(f"Training accuracy: {train_score*100:.2f}%")
    
    # Save model and encoders
    model_path = os.path.join(output_dir, "fertilizer_model.pkl")
    encoders_path = os.path.join(output_dir, "fertilizer_encoders.pkl")
    
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    with open(encoders_path, "wb") as f:
        pickle.dump({
            'le_soil': le_soil,
            'le_crop': le_crop,
            'le_fertilizer': le_fertilizer,
            'soils_list': le_soil.classes_.tolist(),
            'crops_list': le_crop.classes_.tolist(),
            'fertilizers_list': le_fertilizer.classes_.tolist()
        }, f)
        
    print(f"Saved fertilizer model to {model_path}")
    print(f"Saved fertilizer encoders to {encoders_path}")

if __name__ == "__main__":
    train_fertilizer()
