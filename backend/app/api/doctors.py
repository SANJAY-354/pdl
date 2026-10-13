from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import require_doctor
from backend.app.models.entities import Doctor, User
from backend.app.schemas.schemas import DoctorOut, DoctorStatusUpdate

router = APIRouter(prefix="/doctors", tags=["Doctors & Staff"])

@router.get("", response_model=List[DoctorOut])
def list_doctors(
    specialty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)
    if specialty and specialty != "All":
        query = query.filter(Doctor.specialty_name == specialty)
    if status and status != "All":
        query = query.filter(Doctor.status == status)
    return query.all()

@router.patch("/{doctor_id}/status", response_model=DoctorOut)
def update_doctor_status(
    doctor_id: int,
    payload: DoctorStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_doctor)
):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doc.status = payload.status
    db.commit()
    db.refresh(doc)
    return doc
