import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import case, update
from fastapi import HTTPException, status

from backend.app.models.entities import QueueItem, Doctor, ClinicBay, ClinicNotification

VALID_TRANSITIONS = {
    "Waiting": ["Calling", "Delayed", "Cancelled"],
    "Calling": ["In Consultation", "Waiting", "Delayed"],
    "In Consultation": ["Completed", "Delayed"],
    "Delayed": ["Waiting", "Calling", "Cancelled"],
    "Completed": [],
    "Cancelled": [],
}

class QueueService:
    @staticmethod
    def get_queue(db: Session, specialty: Optional[str] = None, status_filter: Optional[str] = None) -> List[QueueItem]:
        query = db.query(QueueItem)
        if specialty and specialty != "All":
            query = query.filter(QueueItem.specialty_name == specialty)
        if status_filter and status_filter != "All":
            query = query.filter(QueueItem.status == status_filter)
        
        # Order by status and priority
        priority_order = case(
            (QueueItem.priority == "Acute Priority", 1),
            (QueueItem.priority == "Urgent", 2),
            (QueueItem.priority == "VIP", 3),
            else_=4
        )
        return query.order_by(QueueItem.status, priority_order, QueueItem.id).all()

    @staticmethod
    def call_next(db: Session, specialty: Optional[str] = None) -> QueueItem:
        query = db.query(QueueItem).filter(QueueItem.status == "Waiting")
        if specialty and specialty != "All":
            query = query.filter(QueueItem.specialty_name == specialty)
        
        priority_order = case(
            (QueueItem.priority == "Acute Priority", 1),
            (QueueItem.priority == "Urgent", 2),
            (QueueItem.priority == "VIP", 3),
            else_=4
        )
        next_item = query.order_by(priority_order, QueueItem.elapsed_wait_minutes.desc()).first()
        
        if not next_item:
            raise HTTPException(status_code=404, detail="No waiting patients in queue for selected specialty")
        
        # Concurrency check with optimistic locking
        current_version = next_item.version_id
        result = db.execute(
            update(QueueItem)
            .where(QueueItem.id == next_item.id, QueueItem.version_id == current_version)
            .values(
                status="Calling",
                predicted_wait_minutes=0,
                version_id=current_version + 1,
                updated_at=datetime.datetime.utcnow()
            )
        )
        if result.rowcount == 0:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Token was concurrently modified by another user. Please retry."
            )
        
        db.commit()
        db.refresh(next_item)
        return next_item

    @staticmethod
    def update_status(db: Session, item_id: int, target_status: str, expected_version: int) -> QueueItem:
        item = db.query(QueueItem).filter(QueueItem.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Queue item not found")
        
        current_status = item.status
        allowed = VALID_TRANSITIONS.get(current_status, [])
        if target_status not in allowed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid state transition from '{current_status}' to '{target_status}'. Allowed: {allowed}"
            )
        
        # Concurrency check
        result = db.execute(
            update(QueueItem)
            .where(QueueItem.id == item_id, QueueItem.version_id == expected_version)
            .values(
                status=target_status,
                version_id=expected_version + 1,
                updated_at=datetime.datetime.utcnow()
            )
        )
        if result.rowcount == 0:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Queue record was concurrently updated by another practitioner. Please refresh."
            )
        
        db.commit()
        db.refresh(item)
        return item
