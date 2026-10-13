from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.entities import ClinicNotification
from backend.app.schemas.schemas import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationOut])
def list_notifications(db: Session = Depends(get_db)):
    return db.query(ClinicNotification).order_by(ClinicNotification.id.desc()).all()

@router.patch("/{notif_id}/read", response_model=NotificationOut)
def mark_as_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(ClinicNotification).filter(ClinicNotification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif
