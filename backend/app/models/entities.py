import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="receptionist")  # admin, doctor, receptionist
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Specialty(Base):
    __tablename__ = "specialties"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    wing = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    role = Column(String(150), nullable=False)
    specialty_name = Column(String(100), nullable=False)
    room_number = Column(String(50), nullable=False)
    avatar = Column(String(500), nullable=True)
    status = Column(String(50), default="Available")  # In Consultation, Available, On Break, Roaming Floater, Off Duty
    patients_seen_today = Column(Integer, default=0)
    current_patient_token = Column(String(50), nullable=True)
    workload_percentage = Column(Integer, default=50)
    shift_hours = Column(String(100), default="08:00 AM - 04:00 PM")

class ClinicBay(Base):
    __tablename__ = "clinic_bays"
    
    id = Column(Integer, primary_key=True, index=True)
    bay_number = Column(String(50), unique=True, nullable=False)
    wing = Column(String(50), nullable=False)
    specialty_name = Column(String(100), nullable=False)
    assigned_doctor = Column(String(150), nullable=True)
    current_status = Column(String(50), default="Ready")  # Occupied, Ready, Cleaning, Reserved, Maintenance
    current_patient_token = Column(String(50), nullable=True)
    equipment_status = Column(String(255), nullable=True)

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    token_number = Column(String(50), index=True, nullable=False)
    patient_name = Column(String(150), nullable=False)
    patient_phone = Column(String(50), nullable=False)
    mrn = Column(String(50), index=True, nullable=False)
    specialty_name = Column(String(100), nullable=False)
    doctor_name = Column(String(150), nullable=False)
    date = Column(String(50), default="Today")
    time_slot = Column(String(50), nullable=False)
    urgency = Column(String(50), default="Routine")
    status = Column(String(50), default="Confirmed")  # Confirmed, Arrived, In Queue, Completed, Cancelled
    ai_predicted_wait_minutes = Column(Integer, default=10)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class QueueItem(Base):
    __tablename__ = "queue_items"
    
    id = Column(Integer, primary_key=True, index=True)
    token_number = Column(String(50), unique=True, index=True, nullable=False)
    patient_name = Column(String(150), nullable=False)
    mrn = Column(String(50), index=True, nullable=False)
    age = Column(Integer, default=30)
    gender = Column(String(10), default="Other")
    specialty_name = Column(String(100), nullable=False)
    priority = Column(String(50), default="Routine")  # Routine, Urgent, Acute Priority, VIP
    room_number = Column(String(50), nullable=False)
    doctor_name = Column(String(150), nullable=False)
    scheduled_time = Column(String(50), default="Immediate")
    check_in_time = Column(String(50), default="Just Now")
    elapsed_wait_minutes = Column(Integer, default=0)
    predicted_wait_minutes = Column(Integer, default=10)
    status = Column(String(50), default="Waiting")  # Waiting, Calling, In Consultation, Delayed, Completed
    notes = Column(Text, nullable=True)
    # Optimistic concurrency version lock:
    version_id = Column(Integer, default=1, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    impact_minutes = Column(Integer, default=10)
    confidence_score = Column(Integer, default=90)
    category = Column(String(100), default="Queue Rebalance")
    status = Column(String(50), default="Pending Approval")  # Pending Approval, Approved, Dismissed
    suggested_action = Column(Text, nullable=False)
    affected_doctor_source = Column(String(150), nullable=True)
    affected_doctor_target = Column(String(150), nullable=True)
    approved_by = Column(String(150), nullable=True)
    approved_at = Column(DateTime, nullable=True)

class ClinicNotification(Base):
    __tablename__ = "clinic_notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(String(100), default="Just now")
    type = Column(String(50), default="info")  # urgent, ai, warning, info
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
