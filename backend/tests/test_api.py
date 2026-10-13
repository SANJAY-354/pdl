import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "MediFlow" in data["service"]

def test_auth_login_success():
    with TestClient(app) as client:
        response = client.post("/api/v1/auth/login", json={
            "email": "admin@mediflow.ai",
            "password": "adminpassword123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "admin"

def test_auth_login_invalid_password():
    with TestClient(app) as client:
        response = client.post("/api/v1/auth/login", json={
            "email": "admin@mediflow.ai",
            "password": "wrongpassword"
        })
        assert response.status_code == 401

def test_get_specialties():
    with TestClient(app) as client:
        response = client.get("/api/v1/specialties")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 5
        names = [s["name"] for s in data]
        assert "Cardiology" in names
        assert "Pediatrics" in names

def test_get_doctors():
    with TestClient(app) as client:
        response = client.get("/api/v1/doctors")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 6

def test_queue_flow_and_optimistic_concurrency():
    with TestClient(app) as client:
        # 1. Fetch queue
        response = client.get("/api/v1/queue")
        assert response.status_code == 200
        queue = response.json()
        assert len(queue) > 0
        
        first_item = queue[0]
        item_id = first_item["id"]
        version_id = first_item["version_id"]
        current_status = first_item["status"]
        
        # 2. Test conflict with outdated version_id
        conflict_resp = client.patch(f"/api/v1/queue/{item_id}/status", json={
            "status": "Calling" if current_status == "Waiting" else "In Consultation",
            "version_id": version_id + 999
        })
        assert conflict_resp.status_code in [400, 409]

def test_ml_prediction_endpoint():
    with TestClient(app) as client:
        response = client.post("/api/v1/ai/predict", json={
            "specialty_name": "Pediatrics",
            "urgency": "Routine",
            "queue_position": 3,
            "doctor_workload_pct": 80,
            "scheduled_hour": 11
        })
        assert response.status_code == 200
        data = response.json()
        assert "predicted_consultation_minutes" in data
        assert "predicted_wait_minutes" in data
        assert data["predicted_wait_minutes"] >= 0
        assert data["confidence_score"] > 80
        assert data["is_simulated"] is True

def test_modular_integrations_endpoints():
    with TestClient(app) as client:
        # Login as staff/admin
        login_resp = client.post("/api/v1/auth/login", json={
            "email": "admin@mediflow.ai",
            "password": "adminpassword123"
        })
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Test Integrations Status
        status_resp = client.get("/api/v1/integrations/status")
        assert status_resp.status_code == 200
        status_data = status_resp.json()
        assert "notifications" in status_data
        assert "fhir" in status_data
        assert "audio" in status_data

        # 2. Test Notification dispatch (mock provider)
        notif_resp = client.post("/api/v1/integrations/notifications/dispatch", json={
            "to_phone": "+15551234567",
            "message": "Token CARD-101 called to Room 101",
            "channel": "sms"
        }, headers=headers)
        assert notif_resp.status_code == 200
        notif_data = notif_resp.json()
        assert notif_data["status"] == "delivered"
        assert notif_data["provider"] == "mock"

        # 3. Test Audio Broadcast
        audio_resp = client.post("/api/v1/integrations/audio/broadcast", json={
            "token_number": "CARD-101",
            "room_number": "101"
        }, headers=headers)
        assert audio_resp.status_code == 200
        audio_data = audio_resp.json()
        assert audio_data["token_number"] == "CARD-101"
        assert "phonetic_announcement" in audio_data

        # 4. Test FHIR Patient Lookup (standalone simulated mode)
        fhir_resp = client.get("/api/v1/integrations/fhir/patient/MRN-78291", headers=headers)
        assert fhir_resp.status_code == 200
        fhir_patient = fhir_resp.json()
        assert fhir_patient["resourceType"] == "Patient"
        assert fhir_patient["id"] == "MRN-78291"

def test_websocket_queue_broadcasts():
    with TestClient(app) as client:
        # Establish active WebSocket connection
        with client.websocket_connect("/ws/queue") as websocket:
            # Authenticate as staff to trigger broadcast
            login_resp = client.post("/api/v1/auth/login", json={
                "email": "receptionist@mediflow.ai",
                "password": "staffpassword123"
            })
            token = login_resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Trigger call-next endpoint
            call_resp = client.post("/api/v1/queue/call-next", headers=headers)
            assert call_resp.status_code == 200

            # 2. Receive broadcast message via WebSocket
            message = websocket.receive_json()
            assert message["type"] == "QUEUE_TOKEN_CALLED"
            assert "token_number" in message["data"]
            assert "room_number" in message["data"]


