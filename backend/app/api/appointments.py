import random
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user, require_staff
from backend.app.models.entities import Appointment, QueueItem, Doctor, User
from backend.app.schemas.schemas import AppointmentOut, AppointmentCreate
from backend.app.ml.predictor import predictor

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("", response_model=List[AppointmentOut])
def list_appointments(
    specialty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Appointment)
    if specialty and specialty != "All":
        query = query.filter(Appointment.specialty_name == specialty)
    if status and status != "All":
        query = query.filter(Appointment.status == status)
    return query.order_by(Appointment.id.desc()).all()

@router.post("", response_model=AppointmentOut)
def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff)
):
    spec_prefix = payload.specialty_name[:4].upper()
    token_num = f"#{spec_prefix}-{random.randint(100, 999)}"
    
    # ML predicted wait
    ml_res = predictor.predict(
        specialty=payload.specialty_name,
        urgency=payload.urgency,
        queue_position=random.randint(2, 6),
        doctor_workload_pct=75
    )
    est_wait = int(ml_res["predicted_wait_minutes"])
    
    is_today = "today" in payload.date.lower()
    apt_status = "In Queue" if is_today else "Confirmed"
    
    apt = Appointment(
        token_number=token_num,
        patient_name=payload.patient_name,
        patient_phone=payload.patient_phone,
        mrn=payload.mrn,
        specialty_name=payload.specialty_name,
        doctor_name=payload.doctor_name,
        date=payload.date,
        time_slot=payload.time_slot,
        urgency=payload.urgency,
        status=apt_status,
        ai_predicted_wait_minutes=est_wait,
        notes=payload.notes,
    )
    db.add(apt)
    
    # If today, auto-enqueue
    if is_today:
        doc = db.query(Doctor).filter(Doctor.name == payload.doctor_name).first()
        room = doc.room_number if doc else "Room 101"
        queue_item = QueueItem(
            token_number=token_num,
            patient_name=payload.patient_name,
            mrn=payload.mrn,
            age=35,
            gender="F",
            specialty_name=payload.specialty_name,
            priority=payload.urgency,
            room_number=room,
            doctor_name=payload.doctor_name,
            scheduled_time=payload.time_slot,
            check_in_time="Just Now",
            elapsed_wait_minutes=0,
            predicted_wait_minutes=est_wait,
            status="Waiting",
            notes=payload.notes or "Scheduled Appointment",
            version_id=1
        )
        db.add(queue_item)
        
    db.commit()
    db.refresh(apt)
    return apt
