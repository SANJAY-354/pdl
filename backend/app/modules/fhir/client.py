import logging
from typing import Optional, Dict, Any, List
from backend.app.core.config import settings

logger = logging.getLogger("mediflow.fhir")

class FHIRClient:
    """
    HL7 FHIR R4 Integration Module.
    Capable of translating internal appointments/patients into standard FHIR R4 resources,
    and querying external FHIR servers when configured.
    """
    def __init__(self, fhir_base_url: Optional[str] = None):
        self.fhir_base_url = fhir_base_url or settings.FHIR_SERVER_URL

    def is_live(self) -> bool:
        return bool(self.fhir_base_url)

    def lookup_patient_by_mrn(self, mrn: str) -> Optional[Dict[str, Any]]:
        """
        Looks up or formats a Patient resource based on Medical Record Number (MRN).
        """
        if not self.fhir_base_url:
            # Standalone simulated FHIR R4 Patient representation
            return {
                "resourceType": "Patient",
                "id": mrn.replace(" ", "-"),
                "identifier": [
                    {
                        "use": "usual",
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "MR",
                                    "display": "Medical Record Number"
                                }
                            ]
                        },
                        "system": "http://hospital.mediflow.ai/patients",
                        "value": mrn
                    }
                ],
                "active": True,
                "name": [
                    {
                        "use": "official",
                        "family": "Simulated",
                        "given": [mrn]
                    }
                ],
                "meta": {
                    "source": "MediFlow Standalone R4 Converter",
                    "mode": "simulated"
                }
            }

        # Live external FHIR server query
        try:
            import httpx
            with httpx.Client(timeout=10.0) as client:
                res = client.get(f"{self.fhir_base_url}/Patient", params={"identifier": mrn})
                if res.status_code == 200:
                    bundle = res.json()
                    entries = bundle.get("entry", [])
                    if entries:
                        return entries[0].get("resource")
        except Exception as e:
            logger.error(f"Error querying external FHIR server: {e}")
        return None

    def export_appointment_to_fhir(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Converts internal MediFlow appointment entity into a compliant HL7 FHIR R4 Appointment resource.
        """
        status_mapping = {
            "CONFIRMED": "booked",
            "PENDING": "proposed",
            "COMPLETED": "fulfilled",
            "CANCELLED": "cancelled",
            "NO_SHOW": "noshow"
        }
        
        fhir_status = status_mapping.get(str(appointment_data.get("status")).upper(), "booked")
        
        return {
            "resourceType": "Appointment",
            "id": f"apt-{appointment_data.get('id')}",
            "status": fhir_status,
            "description": f"Consultation with {appointment_data.get('doctor_name', 'Doctor')}",
            "serviceCategory": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/service-category",
                            "display": appointment_data.get("specialty", "General")
                        }
                    ]
                }
            ],
            "start": f"{appointment_data.get('date')}T{appointment_data.get('time_slot', '09:00')}:00Z" if appointment_data.get('date') else None,
            "comment": appointment_data.get("notes") or "",
            "participant": [
                {
                    "actor": {
                        "reference": f"Patient/{appointment_data.get('mrn', 'UNKNOWN')}",
                        "display": appointment_data.get("patient_name")
                    },
                    "status": "accepted"
                },
                {
                    "actor": {
                        "reference": f"Practitioner/{appointment_data.get('doctor_id')}",
                        "display": appointment_data.get("doctor_name")
                    },
                    "status": "accepted"
                }
            ]
        }

fhir_client = FHIRClient()
