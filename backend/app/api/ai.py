import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import require_admin, get_current_user
from backend.app.core.websocket_manager import ws_manager
from backend.app.models.entities import AIRecommendation, QueueItem, Doctor, User, ClinicNotification
from backend.app.schemas.schemas import (
    AIRecommendationOut,
    AIApprovalAction,
    MLPredictionRequest,
    MLPredictionResponse
)
from backend.app.ml.predictor import predictor

router = APIRouter(prefix="/ai", tags=["AI Scheduling & Predictions"])

@router.get("/recommendations", response_model=List[AIRecommendationOut])
def list_ai_recommendations(db: Session = Depends(get_db)):
    return db.query(AIRecommendation).all()

@router.post("/recommendations/{rec_id}/approve", response_model=AIRecommendationOut)
async def approve_ai_recommendation(
    rec_id: int,
    payload: AIApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)  # Admin approval strictly enforced!
):
    rec = db.query(AIRecommendation).filter(AIRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="AI Recommendation not found")
    
    rec.status = "Approved"
    rec.approved_by = current_user.full_name
    rec.approved_at = datetime.datetime.utcnow()
    
    # Apply rebalance on queue and doctors
    if "Pediatrics Bottleneck" in rec.title:
        delayed_item = db.query(QueueItem).filter(QueueItem.token_number == "#PEDS-303").first()
        if delayed_item:
            delayed_item.doctor_name = "Dr. Emily Vance"
            delayed_item.room_number = "Room 304"
            delayed_item.predicted_wait_minutes = 6
            delayed_item.status = "Waiting"
            delayed_item.notes = "Rebalanced by Admin-approved AI plan to Dr. Vance (Room 304)."
            delayed_item.version_id += 1
            
        doc_chen = db.query(Doctor).filter(Doctor.name == "Dr. Marcus Chen").first()
        doc_vance = db.query(Doctor).filter(Doctor.name == "Dr. Emily Vance").first()
        if doc_chen:
            doc_chen.workload_percentage = 82
        if doc_vance:
            doc_vance.workload_percentage = 74
            
    notif = ClinicNotification(
        title="AI Rebalancing Enacted",
        message=f"{current_user.full_name} approved '{rec.title}'. Queue optimization applied.",
        type="ai"
    )
    db.add(notif)
    db.commit()
    db.refresh(rec)
    
    await ws_manager.broadcast("AI_PLAN_APPROVED", {
        "rec_id": rec.id,
        "title": rec.title,
        "approved_by": rec.approved_by,
    })
    return rec

@router.post("/recommendations/{rec_id}/dismiss", response_model=AIRecommendationOut)
def dismiss_ai_recommendation(
    rec_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    rec = db.query(AIRecommendation).filter(AIRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="AI Recommendation not found")
    
    rec.status = "Dismissed"
    db.commit()
    db.refresh(rec)
    return rec

@router.post("/predict", response_model=MLPredictionResponse)
def predict_consultation_and_wait(payload: MLPredictionRequest):
    result = predictor.predict(
        specialty=payload.specialty_name,
        urgency=payload.urgency,
        queue_position=payload.queue_position,
        doctor_workload_pct=payload.doctor_workload_pct,
        scheduled_hour=payload.scheduled_hour
    )
    return result
