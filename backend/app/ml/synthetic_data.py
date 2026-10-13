import numpy as np
import pandas as pd

def generate_synthetic_clinic_data(n_samples: int = 2500, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    
    specialties = ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Ophthalmology", "General Medicine"]
    specialty_base_duration = {
        "Cardiology": 18.0,
        "Dermatology": 12.0,
        "Pediatrics": 22.0,
        "Orthopedics": 16.0,
        "Ophthalmology": 14.0,
        "General Medicine": 15.0
    }
    
    specialty_choices = np.random.choice(specialties, size=n_samples, p=[0.25, 0.18, 0.22, 0.15, 0.10, 0.10])
    urgencies = np.random.choice(["Routine", "Urgent", "Acute Priority", "VIP"], size=n_samples, p=[0.70, 0.20, 0.08, 0.02])
    queue_positions = np.random.randint(1, 16, size=n_samples)
    doctor_workloads = np.random.randint(40, 98, size=n_samples)
    scheduled_hours = np.random.randint(8, 17, size=n_samples)
    is_peak = np.isin(scheduled_hours, [10, 11, 14, 15]).astype(int)
    
    consultation_durations = []
    waiting_times = []
    
    for spec, urg, q_pos, load, hour, peak in zip(
        specialty_choices, urgencies, queue_positions, doctor_workloads, scheduled_hours, is_peak
    ):
        base_dur = specialty_base_duration[spec]
        
        # Urgency adjustment
        dur_multiplier = 1.0
        if urg == "Acute Priority":
            dur_multiplier = 1.45
        elif urg == "Urgent":
            dur_multiplier = 1.2
            
        noise = np.random.normal(0, 2.5)
        dur = max(5.0, base_dur * dur_multiplier + noise)
        consultation_durations.append(round(dur, 1))
        
        # Wait time modeling
        # Base wait = queue_position * average consultation segment / available room float
        wait_noise = np.random.normal(0, 2.0)
        calculated_wait = (q_pos - 1) * (dur * 0.65) + (load / 100.0) * 4.0 + (peak * 3.5) + wait_noise
        
        if urg == "Acute Priority":
            calculated_wait = max(0.0, np.random.uniform(0.0, 3.0))
        elif urg == "VIP":
            calculated_wait = max(1.0, calculated_wait * 0.4)
            
        waiting_times.append(round(max(0.0, calculated_wait), 1))
        
    df = pd.DataFrame({
        "specialty": specialty_choices,
        "urgency": urgencies,
        "queue_position": queue_positions,
        "doctor_workload_pct": doctor_workloads,
        "scheduled_hour": scheduled_hours,
        "is_peak_hour": is_peak,
        "consultation_duration_minutes": consultation_durations,
        "waiting_time_minutes": waiting_times,
    })
    return df

if __name__ == "__main__":
    df = generate_synthetic_clinic_data(10)
    print("Sample synthetic clinic data:")
    print(df.head())
