import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediFlow AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mediflow.db")
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mediflow_secret_key_change_in_production_jwt_987654321")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # ML Models path
    MODEL_DIR: str = os.getenv("MODEL_DIR", "./backend/app/ml/models")

    # Optional Modular Integrations
    NOTIFICATION_PROVIDER: str = os.getenv("NOTIFICATION_PROVIDER", "mock")  # mock | twilio | log
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")
    TWILIO_WHATSAPP_FROM: str = os.getenv("TWILIO_WHATSAPP_FROM", "")
    
    FHIR_SERVER_URL: str = os.getenv("FHIR_SERVER_URL", "")  # Empty = standalone/simulated FHIR
    ENABLE_AUDIO_CHIME: bool = os.getenv("ENABLE_AUDIO_CHIME", "true").lower() in ("true", "1", "yes")

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
