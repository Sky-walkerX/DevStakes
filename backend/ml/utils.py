import pandas as pd
import numpy as np
import os


def generate_price_data(file_path):
    """Generate synthetic price training data."""
    np.random.seed(42)
    crops = ['tomatoes', 'apples', 'potatoes', 'corn', 'wheat', 'mangoes', 'vegetable']
    months = list(range(1, 13))

    data_price = []
    for _ in range(1000):
        crop = np.random.choice(crops)
        month = np.random.choice(months)
        rainfall = np.random.uniform(50, 300)

        base_prices = {
            'tomatoes': 30, 'apples': 100, 'potatoes': 20,
            'corn': 20, 'wheat': 40, 'mangoes': 120, 'vegetable': 45
        }

        price = base_prices[crop]
        if month in [3, 4, 5, 6]:      # Summer
            if crop == 'mangoes':
                price *= 0.8            # Peak mango season → cheaper
            if crop == 'tomatoes':
                price *= 1.5
        elif month in [7, 8, 9, 10]:   # Monsoon
            price *= 1.2
        else:                           # Winter
            if crop == 'apples':
                price *= 0.9

        price += (rainfall - 150) * 0.05
        data_price.append([crop, month, rainfall, price])

    df_price = pd.DataFrame(data_price, columns=['category', 'month', 'rainfall', 'predicted_price'])
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df_price.to_csv(file_path, index=False)
    return df_price


def generate_rec_data(file_path):
    """Generate synthetic crop recommendation training data."""
    np.random.seed(42)
    soil_types = ['loamy', 'clay', 'sandy', 'alluvial', 'black', 'red', 'laterite']
    seasons = ['summer', 'winter', 'monsoon']

    recommendations = {
        ('loamy',    'summer'):  'Corn',
        ('loamy',    'winter'):  'Wheat',
        ('loamy',    'monsoon'): 'Paddy',
        ('clay',     'summer'):  'Rice',
        ('clay',     'winter'):  'Barley',
        ('clay',     'monsoon'): 'Jute',
        ('sandy',    'summer'):  'Groundnut',
        ('sandy',    'winter'):  'Mustard',
        ('sandy',    'monsoon'): 'Millets',
        ('alluvial', 'summer'):  'Rice',
        ('alluvial', 'winter'):  'Wheat',
        ('alluvial', 'monsoon'): 'Jute',
        ('black',    'summer'):  'Cotton',
        ('black',    'winter'):  'Linseed',
        ('black',    'monsoon'): 'Soybean',
        ('red',      'summer'):  'Groundnut',
        ('red',      'winter'):  'Tobacco',
        ('red',      'monsoon'): 'Ragi',
        ('laterite', 'summer'):  'Cashew',
        ('laterite', 'winter'):  'Tea',
        ('laterite', 'monsoon'): 'Rubber',
    }

    data_rec = []
    for _ in range(500):
        soil = np.random.choice(soil_types)
        season = np.random.choice(seasons)
        rec = recommendations.get((soil.lower(), season.lower()), 'Millets')
        data_rec.append([soil, season, rec])

    df_rec = pd.DataFrame(data_rec, columns=['soil', 'season', 'recommended_crop'])
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df_rec.to_csv(file_path, index=False)
    return df_rec
