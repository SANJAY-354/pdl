from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
import random

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user, require_staff
from backend.app.core.websocket_manager import ws_manager
from backend.app.models.entities import QueueItem, User, ClinicNotification
from backend.app.schemas.schemas import QueueItemOut, QueueStatusUpdate, QueueItemCreate
from backend.app.services.queue_service import QueueService

router = APIRouter(prefix="/queue", tags=["Queue Management"])

@router.get("", response_model=List[QueueItemOut])
def get_queue(
    specialty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return QueueService.get_queue(db, specialty=specialty, status_filter=status)

@router.post("/call-next", response_model=QueueItemOut)
async def call_next_patient(
    specialty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff)
):
    item = QueueService.call_next(db, specialty=specialty)
    
    # Broadcast event via WebSocket
    await ws_manager.broadcast("QUEUE_TOKEN_CALLED", {
        "token_number": item.token_number,
        "patient_name": item.patient_name,
        "room_number": item.room_number,
        "specialty_name": item.specialty_name,
    })
    return item

@router.patch("/{item_id}/status", response_model=QueueItemOut)
async def update_queue_status(
    item_id: int,
    payload: QueueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff)
):
    item = QueueService.update_status(
        db,
        item_id=item_id,
        target_status=payload.status,
        expected_version=payload.version_id
    )
    
    await ws_manager.broadcast("QUEUE_STATUS_UPDATED", {
        "item_id": item.id,
        "token_number": item.token_number,
        "new_status": item.status,
    })
    return item

@router.post("/emergency", response_model=QueueItemOut)
async def admit_emergency_triage(
    payload: QueueItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff)
):
    token_num = f"#EMERG-{random.randint(100, 999)}"
    item = QueueItem(
        token_number=token_num,
        patient_name=payload.patient_name,
        mrn=payload.mrn,
        age=payload.age,
        gender=payload.gender,
        specialty_name=payload.specialty_name,
        priority="Acute Priority",
        room_number="Triage Bay 1",
        doctor_name="Dr. David Kim (Floater)",
        scheduled_time="Immediate",
        check_in_time="Just Now",
        elapsed_wait_minutes=0,
        predicted_wait_minutes=0,
        status="Calling",
        notes=payload.notes or "Acute Emergency Walk-In Admission",
        version_id=1
    )
    db.add(item)
    
    # Create notification
    notif = ClinicNotification(
        title="Emergency Triage Intake",
        message=f"Token {token_num} ({payload.patient_name}) admitted for acute {payload.specialty_name} triage.",
        type="urgent"
    )
    db.add(notif)
    db.commit()
    db.refresh(item)
    
    await ws_manager.broadcast("EMERGENCY_ADMISSION", {
        "token_number": item.token_number,
        "patient_name": item.patient_name,
        "specialty_name": item.specialty_name,
    })
    return item
