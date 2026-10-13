from sqlalchemy.orm import Session
from backend.app.models.entities import (
    User,
    Specialty,
    Doctor,
    ClinicBay,
    Appointment,
    QueueItem,
    AIRecommendation,
    ClinicNotification
)
from backend.app.core.security import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).count() > 0:
        return

    print("Seeding initial MediFlow AI database records...")

    # 1. Staff Users
    users = [
        User(
            email="admin@mediflow.ai",
            hashed_password=get_password_hash("adminpassword123"),
            full_name="Dr. Sarah Lin (CMO)",
            role="admin",
            is_active=True
        ),
        User(
            email="doctor.chen@mediflow.ai",
            hashed_password=get_password_hash("doctorpassword123"),
            full_name="Dr. Marcus Chen",
            role="doctor",
            is_active=True
        ),
        User(
            email="receptionist@mediflow.ai",
            hashed_password=get_password_hash("staffpassword123"),
            full_name="Intake Coordinator",
            role="receptionist",
            is_active=True
        ),
    ]
    db.add_all(users)

    # 2. Specialties
    specialties = [
        Specialty(name="Cardiology", wing="Wing A", description="Comprehensive cardiovascular screening and diagnostics"),
        Specialty(name="Dermatology", wing="Wing B", description="Outpatient dermatologic procedures and skin exams"),
        Specialty(name="Pediatrics", wing="Wing C", description="Infant and child acute triage, wheezing, and well-child visits"),
        Specialty(name="Orthopedics", wing="Wing D", description="Joint assessment, casting, and digital fluoroscopy review"),
        Specialty(name="Ophthalmology", wing="Wing E", description="Slit-lamp examination, corneal topography, and visual field exams"),
        Specialty(name="General Medicine", wing="Wing A", description="Urgent triage and floating clinical assessment"),
    ]
    db.add_all(specialties)

    # 3. Doctors
    doctors = [
        Doctor(
            name="Dr. Sarah Lin",
            role="Chief Medical Officer / Lead Cardiologist",
            specialty_name="Cardiology",
            room_number="Room 101",
            avatar="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
            status="In Consultation",
            patients_seen_today=14,
            current_patient_token="#CARD-104",
            workload_percentage=92,
            shift_hours="08:00 AM - 04:00 PM"
        ),
        Doctor(
            name="Dr. Marcus Chen",
            role="Senior Pediatrician",
            specialty_name="Pediatrics",
            room_number="Room 202",
            avatar="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
            status="In Consultation",
            patients_seen_today=16,
            current_patient_token="#PEDS-302",
            workload_percentage=96,
            shift_hours="08:30 AM - 04:30 PM"
        ),
        Doctor(
            name="Dr. Emily Vance",
            role="Consultant Dermatologist",
            specialty_name="Dermatology",
            room_number="Room 304",
            avatar="https://images.unsplash.com/photo-1594824813637-a169b1652194?auto=format&fit=crop&w=300&q=80",
            status="Available",
            patients_seen_today=9,
            workload_percentage=62,
            shift_hours="09:00 AM - 05:00 PM"
        ),
        Doctor(
            name="Dr. Rajesh Patel",
            role="Orthopedic Surgeon & Specialist",
            specialty_name="Orthopedics",
            room_number="Room 401",
            avatar="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
            status="In Consultation",
            patients_seen_today=11,
            current_patient_token="#ORTHO-405",
            workload_percentage=84,
            shift_hours="08:00 AM - 04:00 PM"
        ),
        Doctor(
            name="Dr. Sophia Rossi",
            role="Ophthalmology Director",
            specialty_name="Ophthalmology",
            room_number="Room 501",
            avatar="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&q=80",
            status="Available",
            patients_seen_today=8,
            workload_percentage=58,
            shift_hours="09:00 AM - 05:00 PM"
        ),
        Doctor(
            name="Dr. David Kim",
            role="Urgent Care & Floater Physician",
            specialty_name="General Medicine",
            room_number="Bay 6 (Overflow)",
            avatar="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
            status="Roaming Floater",
            patients_seen_today=12,
            workload_percentage=74,
            shift_hours="07:30 AM - 03:30 PM"
        ),
    ]
    db.add_all(doctors)

    # 4. Clinic Bays
    bays = [
        ClinicBay(bay_number="Bay 101", wing="Wing A", specialty_name="Cardiology", assigned_doctor="Dr. Sarah Lin", current_status="Occupied", current_patient_token="#CARD-104", equipment_status="12-Lead ECG Calibrated"),
        ClinicBay(bay_number="Bay 102", wing="Wing A", specialty_name="Cardiology", assigned_doctor="Dr. Sarah Lin", current_status="Ready", equipment_status="Echo Probe Ready"),
        ClinicBay(bay_number="Bay 103", wing="Wing A", specialty_name="Cardiology", assigned_doctor="Dr. David Kim", current_status="Cleaning", equipment_status="Sterilizing in Progress (2m)"),
        ClinicBay(bay_number="Bay 201", wing="Wing C", specialty_name="Pediatrics", assigned_doctor="Dr. Marcus Chen", current_status="Occupied", current_patient_token="#PEDS-302", equipment_status="Pediatric Nebulizer Active"),
        ClinicBay(bay_number="Bay 202", wing="Wing C", specialty_name="Pediatrics", assigned_doctor="Dr. Amanda Brooks", current_status="Ready", equipment_status="Infant Scale Calibrated"),
        ClinicBay(bay_number="Bay 203", wing="Wing C", specialty_name="Pediatrics", assigned_doctor="Dr. Marcus Chen", current_status="Reserved", equipment_status="Emergency O2 Cart on Standby"),
        ClinicBay(bay_number="Bay 301", wing="Wing B", specialty_name="Dermatology", assigned_doctor="Dr. Emily Vance", current_status="Occupied", current_patient_token="#DERM-201", equipment_status="Dermatoscope Online"),
        ClinicBay(bay_number="Bay 302", wing="Wing B", specialty_name="Dermatology", assigned_doctor="Dr. Emily Vance", current_status="Ready", equipment_status="Cryo Station Prepped"),
        ClinicBay(bay_number="Bay 401", wing="Wing D", specialty_name="Orthopedics", assigned_doctor="Dr. Rajesh Patel", current_status="Occupied", current_patient_token="#ORTHO-405", equipment_status="C-Arm Digital X-Ray Link"),
        ClinicBay(bay_number="Bay 402", wing="Wing D", specialty_name="Orthopedics", assigned_doctor="Dr. Rajesh Patel", current_status="Ready", equipment_status="Casting Station Prepped"),
        ClinicBay(bay_number="Bay 501", wing="Wing E", specialty_name="Ophthalmology", assigned_doctor="Dr. Sophia Rossi", current_status="Ready", equipment_status="Slit Lamp System Ready"),
        ClinicBay(bay_number="Bay 502", wing="Wing E", specialty_name="Ophthalmology", assigned_doctor="Dr. Sophia Rossi", current_status="Maintenance", equipment_status="Laser Calibration until 12 PM"),
    ]
    db.add_all(bays)

    # 5. Queue Items
    queue_items = [
        QueueItem(
            token_number="#CARD-104",
            patient_name="Elena Vasquez",
            mrn="MRN-94021",
            age=54,
            gender="F",
            specialty_name="Cardiology",
            priority="Routine",
            room_number="Room 101",
            doctor_name="Dr. Sarah Lin",
            scheduled_time="10:15 AM",
            check_in_time="10:10 AM",
            elapsed_wait_minutes=25,
            predicted_wait_minutes=2,
            status="In Consultation",
            notes="Hypertension follow-up & 12-lead ECG review.",
            version_id=1
        ),
        QueueItem(
            token_number="#PEDS-302",
            patient_name="Liam Davis",
            mrn="MRN-88129",
            age=7,
            gender="M",
            specialty_name="Pediatrics",
            priority="Acute Priority",
            room_number="Room 202",
            doctor_name="Dr. Marcus Chen",
            scheduled_time="10:30 AM",
            check_in_time="10:20 AM",
            elapsed_wait_minutes=18,
            predicted_wait_minutes=0,
            status="In Consultation",
            notes="Urgent acute asthma wheezing intake. Nebulizer active.",
            version_id=1
        ),
        QueueItem(
            token_number="#DERM-201",
            patient_name="Marcus Vance Jr.",
            mrn="MRN-77312",
            age=38,
            gender="M",
            specialty_name="Dermatology",
            priority="Routine",
            room_number="Room 304",
            doctor_name="Dr. Emily Vance",
            scheduled_time="10:45 AM",
            check_in_time="10:35 AM",
            elapsed_wait_minutes=8,
            predicted_wait_minutes=5,
            status="Calling",
            notes="Skin lesion biopsy consultation.",
            version_id=1
        ),
        QueueItem(
            token_number="#ORTHO-405",
            patient_name="Sofia Hernandez",
            mrn="MRN-65902",
            age=42,
            gender="F",
            specialty_name="Orthopedics",
            priority="Urgent",
            room_number="Room 401",
            doctor_name="Dr. Rajesh Patel",
            scheduled_time="10:40 AM",
            check_in_time="10:25 AM",
            elapsed_wait_minutes=20,
            predicted_wait_minutes=4,
            status="In Consultation",
            notes="Post-op knee arthroscopy swelling evaluation.",
            version_id=1
        ),
        QueueItem(
            token_number="#PEDS-303",
            patient_name="Noah Jenkins",
            mrn="MRN-91204",
            age=4,
            gender="M",
            specialty_name="Pediatrics",
            priority="Routine",
            room_number="Room 202",
            doctor_name="Dr. Marcus Chen",
            scheduled_time="11:00 AM",
            check_in_time="10:42 AM",
            elapsed_wait_minutes=14,
            predicted_wait_minutes=22,
            status="Delayed",
            notes="Delayed due to urgent acute asthma intake ahead.",
            version_id=1
        ),
        QueueItem(
            token_number="#CARD-105",
            patient_name="Arthur Pendelton",
            mrn="MRN-43190",
            age=68,
            gender="M",
            specialty_name="Cardiology",
            priority="Urgent",
            room_number="Room 101",
            doctor_name="Dr. Sarah Lin",
            scheduled_time="11:15 AM",
            check_in_time="10:48 AM",
            elapsed_wait_minutes=6,
            predicted_wait_minutes=16,
            status="Waiting",
            notes="Arrhythmia monitor readout and medication calibration.",
            version_id=1
        ),
    ]
    db.add_all(queue_items)

    # 6. Appointments
    appointments = [
        Appointment(
            token_number="#CARD-104",
            patient_name="Elena Vasquez",
            patient_phone="+1 (555) 234-8901",
            mrn="MRN-94021",
            specialty_name="Cardiology",
            doctor_name="Dr. Sarah Lin",
            date="Today",
            time_slot="10:15 AM",
            urgency="Routine",
            status="In Queue",
            ai_predicted_wait_minutes=2,
            notes="Hypertension checkup and medication refill."
        ),
        Appointment(
            token_number="#PEDS-302",
            patient_name="Liam Davis",
            patient_phone="+1 (555) 891-2309",
            mrn="MRN-88129",
            specialty_name="Pediatrics",
            doctor_name="Dr. Marcus Chen",
            date="Today",
            time_slot="10:30 AM",
            urgency="Acute Priority",
            status="In Queue",
            ai_predicted_wait_minutes=0,
            notes="Acute respiratory intake with audible wheezing."
        ),
    ]
    db.add_all(appointments)

    # 7. AI Recommendations
    recommendations = [
        AIRecommendation(
            title="Pediatrics Bottleneck Detected — Rebalancing Proposed",
            description="Dr. Chen's queue at 11:30 AM has an estimated 22m delay due to urgent pediatric asthma intake. MediFlow suggests shifting 2 routine follow-ups to Dr. Vance (Dermatology crossover / General Room 4).",
            impact_minutes=16,
            confidence_score=94,
            category="Queue Rebalance",
            status="Pending Approval",
            suggested_action="Shift 2 Pediatric follow-ups to Dr. Vance & notify parents via SMS.",
            affected_doctor_source="Dr. Marcus Chen",
            affected_doctor_target="Dr. Emily Vance"
        ),
        AIRecommendation(
            title="Activate Bay 6 (Overflow) for Cardiology Walk-in Rush",
            description="Anticipated 35% surge in cardiology inquiries post-11:00 AM based on weather humidity and historical arrival patterns. Pre-allocating Bay 6 prevents hallway delays.",
            impact_minutes=11,
            confidence_score=89,
            category="Room Reallocation",
            status="Pending Approval",
            suggested_action="Route Floater Dr. David Kim to Bay 6 for expedited triage.",
            affected_doctor_source="Roaming Pool",
            affected_doctor_target="Dr. David Kim"
        ),
    ]
    db.add_all(recommendations)

    # 8. Notifications
    notifs = [
        ClinicNotification(
            title="Urgent Wait Threshold Warning",
            message="Pediatrics Room 202 wait time projected to exceed 20 min SLA threshold at 11:30 AM.",
            timestamp="2 mins ago",
            type="urgent",
            is_read=False
        ),
        ClinicNotification(
            title="AI Queue Optimization Ready",
            message="Rebalancing plan generated for Dr. Chen and Dr. Vance. Estimated wait reduction: -16m.",
            timestamp="5 mins ago",
            type="ai",
            is_read=False
        ),
    ]
    db.add_all(notifs)

    db.commit()
    print("Database seeding completed successfully.")
