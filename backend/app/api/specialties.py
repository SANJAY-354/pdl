from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import require_staff
from backend.app.models.entities import Specialty, ClinicBay, User
from backend.app.schemas.schemas import SpecialtyOut, ClinicBayOut, ClinicBayUpdate

router = APIRouter(tags=["Specialties & Clinic Bays"])

@router.get("/specialties", response_model=List[SpecialtyOut])
def list_specialties(db: Session = Depends(get_db)):
    return db.query(Specialty).all()

@router.get("/bays", response_model=List[ClinicBayOut])
def list_clinic_bays(db: Session = Depends(get_db)):
    return db.query(ClinicBay).all()

@router.patch("/bays/{bay_id}", response_model=ClinicBayOut)
def update_bay_status(
    bay_id: int,
    payload: ClinicBayUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff)
):
    bay = db.query(ClinicBay).filter(ClinicBay.id == bay_id).first()
    if not bay:
        raise HTTPException(status_code=404, detail="Clinic bay not found")
    
    bay.current_status = payload.current_status
    if payload.assigned_doctor:
        bay.assigned_doctor = payload.assigned_doctor
    
    db.commit()
    db.refresh(bay)
    return bay
