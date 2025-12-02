import sys
import os
import joblib
import xgboost

# Add backend/src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))

def inspect_model():
    model_path = '/app/src/infrastructure/ml/models/xgb_model.pkl'
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        return

    try:
        model = joblib.load(model_path)
        print(f"Model type: {type(model)}")
        
        if hasattr(model, 'feature_names_in_'):
            print("Feature names:", model.feature_names_in_)
        elif hasattr(model, 'get_booster'):
            print("Feature names:", model.get_booster().feature_names)
        else:
            print("Could not determine feature names directly.")
            
        if hasattr(model, 'n_features_in_'):
            print("Number of features:", model.n_features_in_)
            
    except Exception as e:
        print(f"Error inspecting model: {e}")

if __name__ == "__main__":
    inspect_model()
