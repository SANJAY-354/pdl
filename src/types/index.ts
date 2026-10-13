export type SpecialtyType = 
  | 'Cardiology' 
  | 'Dermatology' 
  | 'Pediatrics' 
  | 'Orthopedics' 
  | 'Ophthalmology' 
  | 'General Medicine';

export type QueueStatus = 'Waiting' | 'Calling' | 'In Consultation' | 'Delayed' | 'Completed';
export type PriorityLevel = 'Routine' | 'Urgent' | 'Acute Priority' | 'VIP';

export interface PatientQueueItem {
  id: string;
  tokenNumber: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  specialty: SpecialtyType;
  priority: PriorityLevel;
  roomNumber: string;
  doctorName: string;
  scheduledTime: string;
  checkInTime: string;
  elapsedWaitMinutes: number;
  predictedWaitMinutes: number;
  status: QueueStatus;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  specialty: SpecialtyType;
  roomNumber: string;
  avatar: string;
  status: 'In Consultation' | 'Available' | 'On Break' | 'Roaming Floater' | 'Off Duty';
  patientsSeenToday: number;
  currentPatientToken?: string;
  workloadPercentage: number;
  shiftHours: string;
}

export interface ClinicBay {
  id: string;
  bayNumber: string;
  wing: 'Wing A' | 'Wing B' | 'Wing C' | 'Wing D' | 'Wing E';
  specialty: SpecialtyType;
  assignedDoctor: string;
  currentStatus: 'Occupied' | 'Ready' | 'Cleaning' | 'Reserved' | 'Maintenance';
  currentPatientToken?: string;
  equipmentStatus: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impactMinutes: number;
  confidenceScore: number;
  category: 'Queue Rebalance' | 'Room Reallocation' | 'Staggered Arrival' | 'Staff Floater';
  status: 'Pending Approval' | 'Approved' | 'Dismissed';
  suggestedAction: string;
  affectedDoctorSource?: string;
  affectedDoctorTarget?: string;
}

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientName: string;
  patientPhone: string;
  mrn: string;
  specialty: SpecialtyType;
  doctorName: string;
  date: string;
  timeSlot: string;
  urgency: PriorityLevel;
  status: 'Confirmed' | 'Arrived' | 'In Queue' | 'Completed' | 'Cancelled';
  aiPredictedWaitMinutes: number;
  notes?: string;
}

export interface ClinicNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'ai' | 'info' | 'warning';
  read: boolean;
}

export interface ClinicSettingsState {
  clinicName: string;
  slaMaxWaitMinutes: number;
  requireAdminApprovalForAI: boolean;
  smsNotificationsEnabled: boolean;
  soundAlertsEnabled: boolean;
  roomTurnaroundMinutes: number;
  activeWingCount: number;
  staggeredBookingOffsetMinutes: number;
}
