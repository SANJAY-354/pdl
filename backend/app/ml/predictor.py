import os
import joblib
import pandas as pd
from typing import Dict, Any

from backend.app.core.config import settings

class MLPredictor:
    _instance = None
    _bundle = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.model_path = os.path.join(settings.MODEL_DIR, "mediflow_ml_bundle.joblib")
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self._bundle = joblib.load(self.model_path)
            except Exception as e:
                print(f"Warning: Failed to load ML model from {self.model_path}: {e}")
                self._bundle = None
        else:
            self._bundle = None

    def predict(
        self,
        specialty: str,
        urgency: str,
        queue_position: int,
        doctor_workload_pct: int,
        scheduled_hour: int = 10
    ) -> Dict[str, Any]:
        is_peak = 1 if scheduled_hour in [10, 11, 14, 15] else 0

        # If trained bundle is loaded:
        if self._bundle and "duration_model" in self._bundle and "wait_model" in self._bundle:
            input_df = pd.DataFrame([{
                "specialty": specialty,
                "urgency": urgency,
                "queue_position": queue_position,
                "doctor_workload_pct": doctor_workload_pct,
                "scheduled_hour": scheduled_hour,
                "is_peak_hour": is_peak,
            }])
            
            dur = float(self._bundle["duration_model"].predict(input_df)[0])
            wait = float(self._bundle["wait_model"].predict(input_df)[0])
            version = self._bundle.get("version", "v4.8-trained")
            return {
                "predicted_consultation_minutes": round(max(5.0, dur), 1),
                "predicted_wait_minutes": round(max(0.0, wait), 1),
                "confidence_score": 94,
                "model_version": version,
                "is_simulated": True
            }

        # Fallback heuristic predictor if bundle not yet generated
        base_dur = 15.0
        if specialty == "Cardiology":
            base_dur = 18.0
        elif specialty == "Pediatrics":
            base_dur = 22.0
        elif specialty == "Dermatology":
            base_dur = 12.0
            
        est_wait = max(0.0, (queue_position - 1) * (base_dur * 0.7) + (doctor_workload_pct / 100.0) * 4.0)
        if urgency == "Acute Priority":
            est_wait = 0.0
            
        return {
            "predicted_consultation_minutes": round(base_dur, 1),
            "predicted_wait_minutes": round(est_wait, 1),
            "confidence_score": 90,
            "model_version": "v4.8-fallback-heuristic",
            "is_simulated": True
        }

predictor = MLPredictor.get_instance()
