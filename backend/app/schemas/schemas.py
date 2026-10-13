from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict

# --- Auth Schemas ---
class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "receptionist"

# --- Specialty Schemas ---
class SpecialtyOut(BaseModel):
    id: int
    name: str
    wing: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- Doctor Schemas ---
class DoctorOut(BaseModel):
    id: int
    name: str
    role: str
    specialty_name: str
    room_number: str
    avatar: Optional[str] = None
    status: str
    patients_seen_today: int
    current_patient_token: Optional[str] = None
    workload_percentage: int
    shift_hours: str

    model_config = ConfigDict(from_attributes=True)

class DoctorStatusUpdate(BaseModel):
    status: str

# --- Clinic Bay Schemas ---
class ClinicBayOut(BaseModel):
    id: int
    bay_number: str
    wing: str
    specialty_name: str
    assigned_doctor: Optional[str] = None
    current_status: str
    current_patient_token: Optional[str] = None
    equipment_status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ClinicBayUpdate(BaseModel):
    current_status: str
    assigned_doctor: Optional[str] = None

# --- Appointment Schemas ---
class AppointmentCreate(BaseModel):
    patient_name: str
    patient_phone: str
    mrn: str
    specialty_name: str
    doctor_name: str
    date: str = "Today"
    time_slot: str
    urgency: str = "Routine"
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    token_number: str
    patient_name: str
    patient_phone: str
    mrn: str
    specialty_name: str
    doctor_name: str
    date: str
    time_slot: str
    urgency: str
    status: str
    ai_predicted_wait_minutes: int
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- Queue Item Schemas ---
class QueueItemCreate(BaseModel):
    patient_name: str
    mrn: str
    age: int
    gender: str
    specialty_name: str
    priority: str = "Routine"
    notes: Optional[str] = None

class QueueItemOut(BaseModel):
    id: int
    token_number: str
    patient_name: str
    mrn: str
    age: int
    gender: str
    specialty_name: str
    priority: str
    room_number: str
    doctor_name: str
    scheduled_time: str
    check_in_time: str
    elapsed_wait_minutes: int
    predicted_wait_minutes: int
    status: str
    notes: Optional[str] = None
    version_id: int

    model_config = ConfigDict(from_attributes=True)

class QueueStatusUpdate(BaseModel):
    status: str
    version_id: int  # Required for optimistic locking

# --- AI Recommendation Schemas ---
class AIRecommendationOut(BaseModel):
    id: int
    title: str
    description: str
    impact_minutes: int
    confidence_score: int
    category: str
    status: str
    suggested_action: str
    affected_doctor_source: Optional[str] = None
    affected_doctor_target: Optional[str] = None
    approved_by: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AIApprovalAction(BaseModel):
    notes: Optional[str] = None

# --- ML Prediction Request/Response ---
class MLPredictionRequest(BaseModel):
    specialty_name: str
    urgency: str
    queue_position: int
    doctor_workload_pct: int
    scheduled_hour: int = 10

class MLPredictionResponse(BaseModel):
    predicted_consultation_minutes: float
    predicted_wait_minutes: float
    confidence_score: int
    model_version: str
    is_simulated: bool = False

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    timestamp: str
    type: str
    is_read: bool

    model_config = ConfigDict(from_attributes=True)
