from typing import Optional, Dict, Any

class FHIRClient:
    """
    Independent configurable FHIR integration module.
    Interacts with HL7 FHIR Patient and Appointment resources.
    """
    def __init__(self, fhir_base_url: Optional[str] = None):
        self.fhir_base_url = fhir_base_url

    def lookup_patient_by_mrn(self, mrn: str) -> Optional[Dict[str, Any]]:
        if not self.fhir_base_url:
            # Standalone mode: simulated local FHIR response
            return {
                "resourceType": "Patient",
                "id": mrn,
                "identifier": [{"system": "http://hospital.org/mrn", "value": mrn}],
                "active": True,
                "mode": "standalone_simulated"
            }
        # In production with FHIR endpoint configured:
        # Perform authenticated HTTP GET request to fhir_base_url /Patient?identifier={mrn}
        return None

fhir_client = FHIRClient()
