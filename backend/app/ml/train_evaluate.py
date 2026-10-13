import os
import joblib
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

from backend.app.ml.synthetic_data import generate_synthetic_clinic_data

def train_and_evaluate_models(save_dir: str = "./backend/app/ml/models"):
    os.makedirs(save_dir, exist_ok=True)
    
    print("Generating synthetic clinic training dataset (2,500 encounters)...")
    df = generate_synthetic_clinic_data(n_samples=2500, random_state=42)
    
    feature_cols = ["specialty", "urgency", "queue_position", "doctor_workload_pct", "scheduled_hour", "is_peak_hour"]
    X = df[feature_cols]
    y_duration = df["consultation_duration_minutes"]
    y_wait = df["waiting_time_minutes"]
    
    X_train, X_test, y_dur_train, y_dur_test, y_wait_train, y_wait_test = train_test_split(
        X, y_duration, y_wait, test_size=0.20, random_state=42
    )
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), ["specialty", "urgency"]),
            ("num", "passthrough", ["queue_position", "doctor_workload_pct", "scheduled_hour", "is_peak_hour"]),
        ]
    )
    
    print("\nTraining Model 1: Consultation Duration Predictor (RandomForestRegressor)...")
    duration_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    duration_pipeline.fit(X_train, y_dur_train)
    y_dur_pred = duration_pipeline.predict(X_test)
    
    dur_mae = mean_absolute_error(y_dur_test, y_dur_pred)
    dur_rmse = root_mean_squared_error(y_dur_test, y_dur_pred)
    dur_r2 = r2_score(y_dur_test, y_dur_pred)
    
    print("--- Consultation Duration Model Evaluation ---")
    print(f"MAE:  {dur_mae:.2f} minutes")
    print(f"RMSE: {dur_rmse:.2f} minutes")
    print(f"R²:   {dur_r2:.4f}")
    
    print("\nTraining Model 2: Waiting Time Predictor (GradientBoostingRegressor)...")
    wait_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, max_depth=4, random_state=42))
    ])
    wait_pipeline.fit(X_train, y_wait_train)
    y_wait_pred = wait_pipeline.predict(X_test)
    
    wait_mae = mean_absolute_error(y_wait_test, y_wait_pred)
    wait_rmse = root_mean_squared_error(y_wait_test, y_wait_pred)
    wait_r2 = r2_score(y_wait_test, y_wait_pred)
    
    print("--- Waiting Time Model Evaluation ---")
    print(f"MAE:  {wait_mae:.2f} minutes")
    print(f"RMSE: {wait_rmse:.2f} minutes")
    print(f"R²:   {wait_r2:.4f}")
    
    bundle = {
        "duration_model": duration_pipeline,
        "wait_model": wait_pipeline,
        "metrics": {
            "duration": {"mae": dur_mae, "rmse": dur_rmse, "r2": dur_r2},
            "wait": {"mae": wait_mae, "rmse": wait_rmse, "r2": wait_r2},
        },
        "version": "v4.8-synthetic"
    }
    
    model_path = os.path.join(save_dir, "mediflow_ml_bundle.joblib")
    joblib.dump(bundle, model_path)
    print(f"\nModel bundle saved to: {model_path}")
    return bundle

if __name__ == "__main__":
    train_and_evaluate_models()
