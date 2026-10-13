from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.entities import User, Appointment
from backend.app.modules.notifications.provider import notification_provider
from backend.app.modules.fhir.client import fhir_client
from backend.app.modules.audio.announcer import audio_service
from backend.app.core.config import settings

router = APIRouter(prefix="/integrations", tags=["Integrations"])

class DispatchSMSRequest(BaseModel):
    to_phone: str = Field(..., example="+15550192834")
    message: str = Field(..., example="Your token CARD-101 is called to Bay 3.")
    channel: str = Field("sms", example="sms") # sms | whatsapp

class AudioAnnouncementRequest(BaseModel):
    token_number: str = Field(..., example="CARD-101")
    room_number: str = Field(..., example="101")
    text: Optional[str] = Field(None, example="Calling Token CARD-101 to Consultation Room 101")

@router.get("/status")
def get_integrations_status():
    """
    Returns the real-time configuration status of modular integrations.
    """
    return {
        "notifications": {
            "provider": settings.NOTIFICATION_PROVIDER,
            "twilio_configured": bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN),
            "whatsapp_configured": bool(settings.TWILIO_WHATSAPP_FROM),
        },
        "fhir": {
            "mode": "live" if fhir_client.is_live() else "standalone_simulated",
            "server_url": settings.FHIR_SERVER_URL or None,
            "hl7_version": "R4",
        },
        "audio": {
            "enabled": settings.ENABLE_AUDIO_CHIME,
            "speaker_engine": "web_speech_api_and_chime_synthesizer",
        }
    }

@router.post("/notifications/dispatch")
def dispatch_notification(
    payload: DispatchSMSRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Dispatch SMS or WhatsApp message via configured notification provider.
    """
    if payload.channel == "whatsapp":
        result = notification_provider.send_whatsapp(payload.to_phone, payload.message)
    else:
        result = notification_provider.send_sms(payload.to_phone, payload.message)
    return result

@router.post("/audio/broadcast")
def broadcast_audio(
    payload: AudioAnnouncementRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generates loudspeaker announcement parameters including chime pitch and phonetic speech.
    """
    announcement_text = payload.text or f"Calling Token #{payload.token_number} to Consultation Room {payload.room_number}"
    broadcast_data = audio_service.broadcast_chime(
        token_number=payload.token_number,
        room_number=payload.room_number,
        text=announcement_text
    )
    return broadcast_data

@router.get("/fhir/patient/{mrn}")
def fhir_patient_lookup(
    mrn: str,
    current_user: User = Depends(get_current_user)
):
    """
    Lookup or convert patient record into standard HL7 FHIR R4 Patient resource.
    """
    record = fhir_client.lookup_patient_by_mrn(mrn)
    if not record:
        raise HTTPException(status_code=404, detail=f"FHIR Patient with MRN {mrn} not found")
    return record

@router.get("/fhir/appointment/{appointment_id}")
def fhir_export_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Exports an internal MediFlow appointment to HL7 FHIR R4 Appointment resource.
    """
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    apt_dict = {
        "id": apt.id,
        "patient_name": apt.patient_name,
        "mrn": apt.mrn,
        "doctor_name": apt.doctor_name,
        "doctor_id": apt.doctor_id,
        "specialty": apt.specialty,
        "status": apt.status.value if hasattr(apt.status, "value") else str(apt.status),
        "date": str(apt.date),
        "time_slot": apt.time_slot,
        "notes": apt.notes
    }
    return fhir_client.export_appointment_to_fhir(apt_dict)
