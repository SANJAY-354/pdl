from typing import Dict, Any
from backend.app.core.config import settings

class AudioAnnouncementService:
    """
    Modular lounge loudspeaker announcement service.
    Outputs structured audio chime events and text-to-speech phonetics.
    """
    def __init__(self, enabled: bool = True):
        self.enabled = enabled

    def broadcast_chime(self, token_number: str, room_number: str, text: str) -> Dict[str, Any]:
        """
        Generates broadcast payload with phonetic speech string and chime parameters.
        """
        # Spell out token characters for clear clinic PA announcement
        phonetic_token = " ".join(list(token_number.replace("-", " ")))

        return {
            "enabled": self.enabled,
            "chime_frequency_hz": 523.25,  # C5 pleasant clinic chime
            "chime_pattern": [523.25, 659.25, 783.99], # Ascending C-E-G chime
            "token_number": token_number,
            "room_number": room_number,
            "announcement_text": text,
            "phonetic_announcement": f"Attention please. Token {phonetic_token}. Please proceed to Consultation Room {room_number}.",
            "status": "broadcast_ready" if self.enabled else "audio_disabled"
        }

audio_service = AudioAnnouncementService(enabled=settings.ENABLE_AUDIO_CHIME)
