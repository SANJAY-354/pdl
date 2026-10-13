from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseNotificationProvider(ABC):
    @abstractmethod
    def send_sms(self, to_phone: str, message: str) -> Dict[str, Any]:
        pass

class MockNotificationProvider(BaseNotificationProvider):
    def send_sms(self, to_phone: str, message: str) -> Dict[str, Any]:
        print(f"[MockSMS Dispatch] To: {to_phone} | Message: {message}")
        return {"status": "dispatched", "provider": "mock", "recipient": to_phone}

class LogNotificationProvider(BaseNotificationProvider):
    def send_sms(self, to_phone: str, message: str) -> Dict[str, Any]:
        return {"status": "logged", "provider": "logger", "recipient": to_phone}

# Configurable singleton provider
notification_provider: BaseNotificationProvider = MockNotificationProvider()
