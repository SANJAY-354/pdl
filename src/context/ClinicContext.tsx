import React, { createContext, useContext, useState } from 'react';
import { 
  PatientQueueItem, 
  Doctor, 
  ClinicBay, 
  AIRecommendation, 
  Appointment, 
  ClinicNotification, 
  ClinicSettingsState, 
  SpecialtyType,
  QueueStatus,
  PriorityLevel
} from '../types';
import { 
  INITIAL_DOCTORS, 
  INITIAL_QUEUE, 
  INITIAL_BAYS, 
  INITIAL_AI_RECOMMENDATIONS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SETTINGS 
} from '../data/mockData';

export type RouteType = 
  | 'operations' 
  | 'live-queue' 
  | 'appointments' 
  | 'specialties' 
  | 'staff-schedule' 
  | 'ai-insights' 
  | 'analytics' 
  | 'settings';

interface Toast {
  title: string;
  desc: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface ClinicContextType {
  currentRoute: RouteType;
  setCurrentRoute: (route: RouteType) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  queue: PatientQueueItem[];
  doctors: Doctor[];
  bays: ClinicBay[];
  recommendations: AIRecommendation[];
  appointments: Appointment[];
  notifications: ClinicNotification[];
  settings: ClinicSettingsState;

  // Modals & Drawers
  isBookingDrawerOpen: boolean;
  setIsBookingDrawerOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isAIApprovalModalOpen: boolean;
  setIsAIApprovalModalOpen: (open: boolean) => void;
  selectedRecommendation: AIRecommendation | null;
  setSelectedRecommendation: (rec: AIRecommendation | null) => void;
  isAudioModalOpen: boolean;
  setIsAudioModalOpen: (open: boolean) => void;
  activeAnnouncementText: string;

  toast: Toast | null;
  showToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  clearToast: () => void;

  // Actions
  callNextPatient: (specialty?: string) => void;
  updatePatientStatus: (patientId: string, newStatus: QueueStatus) => void;
  addNewAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber' | 'aiPredictedWaitMinutes' | 'status'>) => Appointment;
  approveRecommendation: (recId: string) => void;
  dismissRecommendation: (recId: string) => void;
  admitEmergencyPatient: (patient: { name: string; mrn: string; age: number; gender: 'M' | 'F' | 'Other'; specialty: SpecialtyType; condition: string }) => void;
  updateBayStatus: (bayId: string, status: ClinicBay['currentStatus'], doctor?: string) => void;
  updateDoctorStatus: (doctorId: string, status: Doctor['status']) => void;
  updateSettings: (newSettings: Partial<ClinicSettingsState>) => void;
  broadcastAudioChime: (message: string) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('operations');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [queue, setQueue] = useState<PatientQueueItem[]>(INITIAL_QUEUE);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [bays, setBays] = useState<ClinicBay[]>(INITIAL_BAYS);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<ClinicNotification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<ClinicSettingsState>(INITIAL_SETTINGS);

  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAIApprovalModalOpen, setIsAIApprovalModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [activeAnnouncementText, setActiveAnnouncementText] = useState('');

  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    setToast({ title, desc, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const broadcastAudioChime = (message: string) => {
    setActiveAnnouncementText(message);
    setIsAudioModalOpen(true);
    showToast('Broadcast Announcement', message, 'info');
  };

  const callNextPatient = (specialtyFilter?: string) => {
    const candidate = queue.find(p => 
      p.status === 'Waiting' && 
      (!specialtyFilter || specialtyFilter === 'All' || p.specialty === specialtyFilter)
    );

    if (!candidate) {
      showToast('No Waiting Patients', 'There are no pending patients in the selected queue.', 'info');
      return;
    }

    setQueue(prev => prev.map(p => {
      if (p.id === candidate.id) {
        return { ...p, status: 'Calling', predictedWaitMinutes: 0 };
      }
      return p;
    }));

    broadcastAudioChime(`Calling Token ${candidate.tokenNumber} — ${candidate.patientName} to ${candidate.roomNumber}`);
    showToast('Token Called', `${candidate.tokenNumber} (${candidate.patientName}) called to ${candidate.roomNumber}`, 'success');
  };

  const updatePatientStatus = (patientId: string, newStatus: QueueStatus) => {
    setQueue(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
    showToast('Status Updated', `Patient queue status changed to ${newStatus}`, 'info');
  };

  const addNewAppointment = (data: Omit<Appointment, 'id' | 'tokenNumber' | 'aiPredictedWaitMinutes' | 'status'>): Appointment => {
    const tokenPrefix = data.specialty.substring(0, 4).toUpperCase();
    const tokenNum = Math.floor(100 + Math.random() * 900);
    const tokenNumber = `#${tokenPrefix}-${tokenNum}`;
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      tokenNumber,
      status: data.date.toLowerCase().includes('today') ? 'In Queue' : 'Confirmed',
      aiPredictedWaitMinutes: Math.floor(8 + Math.random() * 12),
    };

    setAppointments(prev => [newApt, ...prev]);

    // If today, push to active queue
    if (data.date.toLowerCase().includes('today')) {
      const assignedDoctor = doctors.find(d => d.name === data.doctorName) || doctors[0];
      const newQueueItem: PatientQueueItem = {
        id: `q-${Date.now()}`,
        tokenNumber,
        patientName: data.patientName,
        mrn: data.mrn,
        age: 32,
        gender: 'F',
        specialty: data.specialty,
        priority: data.urgency,
        roomNumber: assignedDoctor.roomNumber,
        doctorName: assignedDoctor.name,
        scheduledTime: data.timeSlot,
        checkInTime: 'Just Now',
        elapsedWaitMinutes: 0,
        predictedWaitMinutes: newApt.aiPredictedWaitMinutes,
        status: 'Waiting',
        notes: data.notes || 'Newly scheduled clinic appointment.',
      };
      setQueue(prev => [...prev, newQueueItem]);
    }

    showToast('Appointment Booked', `Token ${tokenNumber} generated for ${data.patientName}.`, 'success');
    return newApt;
  };

  const approveRecommendation = (recId: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Approved' } : r));

    // Apply simulated rebalancing optimizations
    if (recId === 'ai-rec-1') {
      // Rebalance Dr. Chen delayed patient to Dr. Vance
      setQueue(prev => prev.map(p => {
        if (p.tokenNumber === '#PEDS-303') {
          return {
            ...p,
            doctorName: 'Dr. Emily Vance',
            roomNumber: 'Room 304',
            predictedWaitMinutes: 6,
            status: 'Waiting',
            notes: 'Rebalanced by AI to Dr. Vance (Derm Room 4). Wait reduced from 22m to 6m.',
          };
        }
        return p;
      }));

      // Update doctor workloads
      setDoctors(prev => prev.map(d => {
        if (d.name === 'Dr. Marcus Chen') return { ...d, workloadPercentage: 82 };
        if (d.name === 'Dr. Emily Vance') return { ...d, workloadPercentage: 74 };
        return d;
      }));
    } else if (recId === 'ai-rec-2') {
      // Activate Bay 6
      setBays(prev => prev.map(b => {
        if (b.bayNumber === 'Bay 103') return { ...b, currentStatus: 'Ready' };
        return b;
      }));
    }

    // Add notification
    const newNotif: ClinicNotification = {
      id: `notif-${Date.now()}`,
      title: 'AI Recommendation Enacted',
      message: `Admin approved "${rec.title}". Queue dynamically optimized.`,
      timestamp: 'Just now',
      type: 'ai',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('AI Plan Enacted', `${rec.title} was approved. Queue times optimized!`, 'success');
    setIsAIApprovalModalOpen(false);
  };

  const dismissRecommendation = (recId: string) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Dismissed' } : r));
    showToast('Recommendation Dismissed', 'Recommendation archived without applying changes.', 'info');
    setIsAIApprovalModalOpen(false);
  };

  const admitEmergencyPatient = (patient: { name: string; mrn: string; age: number; gender: 'M' | 'F' | 'Other'; specialty: SpecialtyType; condition: string }) => {
    const tokenNumber = `#EMERG-${Math.floor(100 + Math.random() * 900)}`;
    const newQueueItem: PatientQueueItem = {
      id: `q-${Date.now()}`,
      tokenNumber,
      patientName: patient.name,
      mrn: patient.mrn,
      age: patient.age,
      gender: patient.gender,
      specialty: patient.specialty,
      priority: 'Acute Priority',
      roomNumber: 'Triage Bay 1',
      doctorName: 'Dr. David Kim (Floater)',
      scheduledTime: 'Immediate',
      checkInTime: 'Just Now',
      elapsedWaitMinutes: 0,
      predictedWaitMinutes: 0,
      status: 'Calling',
      notes: `EMERGENCY TRIAGE: ${patient.condition}. Immediate clinical intervention.`,
    };

    setQueue(prev => [newQueueItem, ...prev]);

    const notif: ClinicNotification = {
      id: `notif-${Date.now()}`,
      title: 'Emergency Triage Admitted',
      message: `${patient.name} (${tokenNumber}) admitted for acute ${patient.specialty} triage.`,
      timestamp: 'Just now',
      type: 'urgent',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    broadcastAudioChime(`Code Triage: Emergency Intake for ${patient.name} (${tokenNumber}) in Triage Bay 1`);
    showToast('Emergency Admitted', `Token ${tokenNumber} admitted with top priority.`, 'warning');
    setIsEmergencyModalOpen(false);
  };

  const updateBayStatus = (bayId: string, status: ClinicBay['currentStatus'], doctor?: string) => {
    setBays(prev => prev.map(b => {
      if (b.id === bayId) {
        return { ...b, currentStatus: status, ...(doctor ? { assignedDoctor: doctor } : {}) };
      }
      return b;
    }));
    showToast('Bay Updated', `Bay status updated to ${status}.`, 'info');
  };

  const updateDoctorStatus = (doctorId: string, status: Doctor['status']) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, status } : d));
    showToast('Doctor Status Updated', `Physician status updated to ${status}.`, 'info');
  };

  const updateSettings = (newSettings: Partial<ClinicSettingsState>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'Clinic configuration updated successfully.', 'success');
  };

  return (
    <ClinicContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedSpecialty,
        setSelectedSpecialty,
        searchQuery,
        setSearchQuery,
        queue,
        doctors,
        bays,
        recommendations,
        appointments,
        notifications,
        settings,
        isBookingDrawerOpen,
        setIsBookingDrawerOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isAIApprovalModalOpen,
        setIsAIApprovalModalOpen,
        selectedRecommendation,
        setSelectedRecommendation,
        isAudioModalOpen,
        setIsAudioModalOpen,
        activeAnnouncementText,
        toast,
        showToast,
        clearToast,
        callNextPatient,
        updatePatientStatus,
        addNewAppointment,
        approveRecommendation,
        dismissRecommendation,
        admitEmergencyPatient,
        updateBayStatus,
        updateDoctorStatus,
        updateSettings,
        broadcastAudioChime,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
