import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from backend.app.core.config import settings

logger = logging.getLogger("mediflow.notifications")

class BaseNotificationProvider(ABC):
    @abstractmethod
    def send_sms(self, to_phone: str, message: str) -> Dict[str, Any]:
        """Send an SMS notification to a recipient."""
        pass

    @abstractmethod
    def send_whatsapp(self, to_phone: str, message: str) -> Dict[str, Any]:
        """Send a WhatsApp notification to a recipient."""
        pass

class MockNotificationProvider(BaseNotificationProvider):
    """
    Development & test provider. Safely simulates SMS/WhatsApp dispatches without sending real messages.
    """
    def send_sms(self, to_phone: str, message: str) -> Dict[str, Any]:
        logger.info(f"[MockSMS] Dispatching to {to_phone}: {message}")
        return {
            "status": "delivered",
            "provider": "mock",
            "channel": "sms",
            "recipient": to_phone,
            "message_preview": message[:60] + "..." if len(message) > 60 else message,
            "message_id": f"mock_sms_{abs(hash(to_phone + message)) % 100000}"
        }

    def send_whatsapp(self, to_phone: str, message: str) -> Dict[str, Any]:
        logger.info(f"[MockWhatsApp] Dispatching to {to_phone}: {message}")
        return {
            "status": "delivered",
            "provider": "mock",
            "channel": "whatsapp",
            "recipient": to_phone,
            "message_preview": message[:60] + "..." if len(message) > 60 else message,
            "message_id": f"mock_wa_{abs(hash(to_phone + message)) % 100000}"
        }

class TwilioNotificationProvider(BaseNotificationProvider):
    """
    Production-ready Twilio client. Only connects when valid account credentials are configured.
    """
    def __init__(self, account_sid: str, auth_token: str, from_phone: str, whatsapp_from: Optional[str] = None):
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.from_phone = from_phone
        self.whatsapp_from = whatsapp_from

    def send_sms(self, to_phone: str, message: str) -> Dict[str, Any]:
        if not self.account_sid or not self.auth_token or not self.from_phone:
            logger.warning("Twilio credentials not configured. Falling back to simulated log dispatch.")
            return {
                "status": "simulated_missing_credentials",
                "provider": "twilio_unconfigured",
                "recipient": to_phone
            }
        try:
            # Twilio REST API without heavy SDK dependency or using twilio if installed
            import httpx
            url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
            data = {"From": self.from_phone, "To": to_phone, "Body": message}
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, data=data, auth=(self.account_sid, self.auth_token))
                if res.status_code in (200, 201):
                    body = res.json()
                    return {"status": "sent", "provider": "twilio", "sid": body.get("sid"), "recipient": to_phone}
                else:
                    logger.error(f"Twilio API error ({res.status_code}): {res.text}")
                    return {"status": "error", "error": res.text, "recipient": to_phone}
        except Exception as e:
            logger.error(f"Twilio dispatch exception: {e}")
            return {"status": "failed", "error": str(e), "recipient": to_phone}

    def send_whatsapp(self, to_phone: str, message: str) -> Dict[str, Any]:
        from_number = self.whatsapp_from or f"whatsapp:{self.from_phone}"
        to_number = to_phone if to_phone.startswith("whatsapp:") else f"whatsapp:{to_phone}"
        if not self.account_sid or not self.auth_token:
            return {"status": "simulated_missing_credentials", "provider": "twilio_unconfigured", "recipient": to_phone}
        try:
            import httpx
            url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
            data = {"From": from_number, "To": to_number, "Body": message}
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, data=data, auth=(self.account_sid, self.auth_token))
                if res.status_code in (200, 201):
                    body = res.json()
                    return {"status": "sent", "provider": "twilio_whatsapp", "sid": body.get("sid"), "recipient": to_phone}
                else:
                    return {"status": "error", "error": res.text, "recipient": to_phone}
        except Exception as e:
            return {"status": "failed", "error": str(e), "recipient": to_phone}

def get_notification_provider() -> BaseNotificationProvider:
    if settings.NOTIFICATION_PROVIDER == "twilio" and settings.TWILIO_ACCOUNT_SID:
        return TwilioNotificationProvider(
            account_sid=settings.TWILIO_ACCOUNT_SID,
            auth_token=settings.TWILIO_AUTH_TOKEN,
            from_phone=settings.TWILIO_FROM_NUMBER,
            whatsapp_from=settings.TWILIO_WHATSAPP_FROM
        )
    return MockNotificationProvider()

notification_provider: BaseNotificationProvider = get_notification_provider()
