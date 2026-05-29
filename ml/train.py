import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

datasets_dir = "/Users/nithishkumarreddy/Documents/farmer/datasets"
output_dir = "/Users/nithishkumarreddy/Documents/farmer/ml"
os.makedirs(output_dir, exist_ok=True)

# Peak harvest months mapping for different crops to simulate arrivals/stock
crop_harvest_months = {
    'Onion': [4, 5, 10, 11],
    'Potato': [1, 2, 3, 11, 12],
    'Tomato': [1, 2, 6, 7, 8],
    'Paddy': [10, 11, 12],
    'Wheat': [3, 4, 5],
    'Cotton': [10, 11, 12, 1],
    'Sugarcane': [12, 1, 2, 3],
    'Maize': [9, 10, 11],
    'Bajra': [10, 11],
    'Barley': [3, 4],
    'Gram': [2, 3, 4],
    'Groundnut': [10, 11, 12],
    'Sponge Gourd': [5, 6, 7, 8],
    'Ginger': [12, 1, 2],
    'Peas': [11, 12, 1],
    'Papaya': [2, 3, 4, 5]
}

def simulate_stock_level(crop, month):
    # Base arrivals in Tonnes
    base_stock = 150.0
    peaks = crop_harvest_months.get(crop, [5, 10])
    
    if month in peaks:
        # High stock during harvest
        return float(np.random.normal(loc=950.0, scale=120.0))
    elif any(abs(month - p) == 1 for p in peaks):
        # Medium stock near harvest months
        return float(np.random.normal(loc=480.0, scale=70.0))
    else:
        # Low stock off-season
        return float(np.random.normal(loc=120.0, scale=25.0))

def train_model():
    print("Loading Vegetable and Fruits Prices Excel dataset...")
    xlsx_path = os.path.join(datasets_dir, "Vegetable and Fruits Prices  in India.xlsx")
    df = pd.read_excel(xlsx_path, sheet_name="Sheet1")
    
    print("Initial processing...")
    df = df.dropna(subset=['Item Name', 'price'])
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df = df.dropna(subset=['Date'])
    
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.month
    
    print("Grouping prices to monthly averages...")
    df_monthly = df.groupby(['Item Name', 'Year', 'Month']).agg({'price': 'mean'}).reset_index()
    
    print("Loading district-wise normal rainfall dataset...")
    rainfall_path = os.path.join(datasets_dir, "district wise rainfall normal.csv")
    df_rain = pd.read_csv(rainfall_path)
    
    months_map = {
        1: 'JAN', 2: 'FEB', 3: 'MAR', 4: 'APR', 5: 'MAY', 6: 'JUN',
        7: 'JUL', 8: 'AUG', 9: 'SEP', 10: 'OCT', 11: 'NOV', 12: 'DEC'
    }
    
    rain_melted = df_rain.melt(
        id_vars=['STATE_UT_NAME', 'DISTRICT'],
        value_vars=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        var_name='Month_Name',
        value_name='Rainfall'
    )
    month_name_to_num = {v: k for k, v in months_map.items()}
    rain_melted['Month'] = rain_melted['Month_Name'].map(month_name_to_num)
    
    national_rain_monthly = rain_melted.groupby('Month')['Rainfall'].mean().reset_index()
    
    df_train = pd.merge(df_monthly, national_rain_monthly, on='Month', how='left')
    df_train['Rainfall'] = df_train['Rainfall'].fillna(df_train['Rainfall'].mean())
    
    # Process WPI dataset
    print("Processing Wholesale Price Index (WPI) dataset...")
    wpi_path = os.path.join(datasets_dir, "Wholesale-Price-Index-from-2012-to-2024.csv")
    try:
        df_wpi = pd.read_csv(wpi_path)
        wpi_cols = [c for c in df_wpi.columns if c != 'Crop']
        df_wpi_long = df_wpi.melt(id_vars=['Crop'], value_vars=wpi_cols, var_name='Month_Year', value_name='WPI_Value')
        
        df_wpi_long['Date'] = pd.to_datetime(df_wpi_long['Month_Year'], format='%B-%Y', errors='coerce')
        df_wpi_long = df_wpi_long.dropna(subset=['Date', 'WPI_Value'])
        df_wpi_long['Year'] = df_wpi_long['Date'].dt.year
        df_wpi_long['Month'] = df_wpi_long['Date'].dt.month
        
        baseline_prices = {
            'Bajra': 15, 'Barley': 16, 'Gram': 40, 'Groundnut': 50,
            'Jowar': 18, 'Maize': 15, 'Paddy': 20, 'Ragi': 22,
            'Wheat': 18, 'Cotton': 50, 'Sugarcane': 3.5
        }
        
        wpi_records = []
        for index, row in df_wpi_long.iterrows():
            crop = row['Crop']
            year = row['Year']
            month = row['Month']
            wpi_val = row['WPI_Value']
            
            base = baseline_prices.get(crop, 20.0)
            price = base * (wpi_val / 100.0)
            
            wpi_records.append({
                'Item Name': crop,
                'Year': year,
                'Month': month,
                'price': price
            })
            
        df_wpi_prices = pd.DataFrame(wpi_records)
        df_wpi_train = pd.merge(df_wpi_prices, national_rain_monthly, on='Month', how='left')
        df_wpi_train['Rainfall'] = df_wpi_train['Rainfall'].fillna(df_wpi_train['Rainfall'].mean())
        
        df_train = pd.concat([df_train, df_wpi_train], ignore_index=True)
    except Exception as e:
        print("Error processing WPI dataset:", e)
        
    df_train['Item Name'] = df_train['Item Name'].str.strip()
    
    # Simulate Stock (Arrivals Volume) for all rows based on crop and month
    print("Simulating market stock (arrivals volume) based on crop harvest calendars...")
    df_train['Stock'] = df_train.apply(lambda r: simulate_stock_level(r['Item Name'], r['Month']), axis=1)
    
    # Train Label Encoder for Crops
    le_crop = LabelEncoder()
    df_train['Crop_Encoded'] = le_crop.fit_transform(df_train['Item Name'])
    
    # Prepare features and target (Features: Crop, Month, Rainfall, Year, Stock)
    X = df_train[['Crop_Encoded', 'Month', 'Rainfall', 'Year', 'Stock']]
    y = df_train['price']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Regressor with Stock features...")
    model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42)
    model.fit(X_train, y_train)
    
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Train R^2 score: {train_score:.4f}")
    print(f"Test R^2 score: {test_score:.4f}")
    
    # Save model and encoders
    model_path = os.path.join(output_dir, "model.pkl")
    encoders_path = os.path.join(output_dir, "encoders.pkl")
    
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    with open(encoders_path, "wb") as f:
        pickle.dump({
            'le_crop': le_crop,
            'crops_list': le_crop.classes_.tolist()
        }, f)
        
    print("Saved model and encoders successfully.")

if __name__ == "__main__":
    train_model()
