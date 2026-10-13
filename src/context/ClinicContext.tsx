import React, { createContext, useContext, useState, useEffect } from 'react';
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
  StaffUser
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
import { api } from '../services/api';
import { wsClient } from '../services/websocket';

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

  currentUser: StaffUser;
  switchRole: (role: 'admin' | 'doctor' | 'receptionist') => Promise<void>;

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
  callNextPatient: (specialty?: string) => Promise<void>;
  updatePatientStatus: (patientId: string, newStatus: QueueStatus) => Promise<void>;
  addNewAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber' | 'aiPredictedWaitMinutes' | 'status'>) => Promise<Appointment>;
  approveRecommendation: (recId: string) => Promise<void>;
  dismissRecommendation: (recId: string) => Promise<void>;
  admitEmergencyPatient: (patient: { name: string; mrn: string; age: number; gender: 'M' | 'F' | 'Other'; specialty: SpecialtyType; condition: string }) => Promise<void>;
  updateBayStatus: (bayId: string, status: ClinicBay['currentStatus'], doctor?: string) => void;
  updateDoctorStatus: (doctorId: string, status: Doctor['status']) => void;
  updateSettings: (newSettings: Partial<ClinicSettingsState>) => void;
  broadcastAudioChime: (message: string) => void;
  refreshData: () => Promise<void>;
}

const DEFAULT_ADMIN: StaffUser = {
  id: 1,
  email: 'admin@mediflow.ai',
  full_name: 'Dr. Sarah Lin (CMO)',
  role: 'admin',
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('operations');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [currentUser, setCurrentUser] = useState<StaffUser>(DEFAULT_ADMIN);

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

  // Sync data from FastAPI backend
  const refreshData = async () => {
    try {
      const [backendQueue, backendDoctors, backendBays, backendAppointments, backendRecs, backendNotifs] =
        await Promise.allSettled([
          api.getQueue(),
          api.getDoctors(),
          api.getBays(),
          api.getAppointments(),
          api.getRecommendations(),
          api.getNotifications(),
        ]);

      if (backendQueue.status === 'fulfilled' && backendQueue.value.length > 0) {
        setQueue(backendQueue.value.map((item: any) => ({
          id: String(item.id),
          tokenNumber: item.token_number,
          patientName: item.patient_name,
          mrn: item.mrn,
          age: item.age,
          gender: item.gender,
          specialty: item.specialty_name,
          priority: item.priority,
          roomNumber: item.room_number,
          doctorName: item.doctor_name,
          scheduledTime: item.scheduled_time,
          checkInTime: item.check_in_time,
          elapsedWaitMinutes: item.elapsed_wait_minutes,
          predictedWaitMinutes: item.predicted_wait_minutes,
          status: item.status,
          notes: item.notes,
          version_id: item.version_id,
        })));
      }

      if (backendDoctors.status === 'fulfilled' && backendDoctors.value.length > 0) {
        setDoctors(backendDoctors.value.map((doc: any) => ({
          id: String(doc.id),
          name: doc.name,
          role: doc.role,
          specialty: doc.specialty_name,
          roomNumber: doc.room_number,
          avatar: doc.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
          status: doc.status,
          patientsSeenToday: doc.patients_seen_today,
          currentPatientToken: doc.current_patient_token,
          workloadPercentage: doc.workload_percentage,
          shiftHours: doc.shift_hours,
        })));
      }

      if (backendBays.status === 'fulfilled' && backendBays.value.length > 0) {
        setBays(backendBays.value.map((b: any) => ({
          id: String(b.id),
          bayNumber: b.bay_number,
          wing: b.wing,
          specialty: b.specialty_name,
          assignedDoctor: b.assigned_doctor,
          currentStatus: b.current_status,
          currentPatientToken: b.current_patient_token,
          equipmentStatus: b.equipment_status,
        })));
      }

      if (backendAppointments.status === 'fulfilled' && backendAppointments.value.length > 0) {
        setAppointments(backendAppointments.value.map((a: any) => ({
          id: String(a.id),
          tokenNumber: a.token_number,
          patientName: a.patient_name,
          patientPhone: a.patient_phone,
          mrn: a.mrn,
          specialty: a.specialty_name,
          doctorName: a.doctor_name,
          date: a.date,
          timeSlot: a.time_slot,
          urgency: a.urgency,
          status: a.status,
          aiPredictedWaitMinutes: a.ai_predicted_wait_minutes,
          notes: a.notes,
        })));
      }

      if (backendRecs.status === 'fulfilled' && backendRecs.value.length > 0) {
        setRecommendations(backendRecs.value.map((r: any) => ({
          id: String(r.id),
          title: r.title,
          description: r.description,
          impactMinutes: r.impact_minutes,
          confidenceScore: r.confidence_score,
          category: r.category,
          status: r.status,
          suggestedAction: r.suggested_action,
          affectedDoctorSource: r.affected_doctor_source,
          affectedDoctorTarget: r.affected_doctor_target,
        })));
      }

      if (backendNotifs.status === 'fulfilled' && backendNotifs.value.length > 0) {
        setNotifications(backendNotifs.value.map((n: any) => ({
          id: String(n.id),
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          type: n.type,
          read: n.is_read,
        })));
      }
    } catch {
      // Graceful fallback to initial mockData
    }
  };

  // Setup WebSocket listeners on mount
  useEffect(() => {
    refreshData();
    wsClient.connect();

    const handleTokenCalled = (data: any) => {
      broadcastAudioChime(`Calling Token ${data.token_number} — ${data.patient_name} to ${data.room_number}`);
      refreshData();
    };

    const handleQueueUpdated = () => {
      refreshData();
    };

    const handleEmergency = (data: any) => {
      showToast('Emergency Triage Alert', `${data.patient_name} (${data.token_number}) admitted for urgent intake!`, 'warning');
      refreshData();
    };

    const handleAIApproved = (data: any) => {
      showToast('AI Plan Enacted', `Admin approved "${data.title}" by ${data.approved_by}`, 'success');
      refreshData();
    };

    wsClient.on('QUEUE_TOKEN_CALLED', handleTokenCalled);
    wsClient.on('QUEUE_STATUS_UPDATED', handleQueueUpdated);
    wsClient.on('EMERGENCY_ADMISSION', handleEmergency);
    wsClient.on('AI_PLAN_APPROVED', handleAIApproved);

    return () => {
      wsClient.off('QUEUE_TOKEN_CALLED', handleTokenCalled);
      wsClient.off('QUEUE_STATUS_UPDATED', handleQueueUpdated);
      wsClient.off('EMERGENCY_ADMISSION', handleEmergency);
      wsClient.off('AI_PLAN_APPROVED', handleAIApproved);
    };
  }, []);

  // Switch role with backend authentication
  const switchRole = async (role: 'admin' | 'doctor' | 'receptionist') => {
    const credentials = {
      admin: { email: 'admin@mediflow.ai', password: 'adminpassword123', name: 'Dr. Sarah Lin (CMO)' },
      doctor: { email: 'doctor.chen@mediflow.ai', password: 'doctorpassword123', name: 'Dr. Marcus Chen' },
      receptionist: { email: 'receptionist@mediflow.ai', password: 'staffpassword123', name: 'Intake Coordinator' },
    }[role];

    try {
      const authResult = await api.login(credentials.email, credentials.password);
      localStorage.setItem('mediflow_token', authResult.access_token);
      setCurrentUser(authResult.user);
      showToast('Role Switched', `Logged in as ${authResult.user.full_name} (${authResult.user.role.toUpperCase()})`, 'info');
    } catch {
      // Local fallback
      setCurrentUser({
        id: role === 'admin' ? 1 : role === 'doctor' ? 2 : 3,
        email: credentials.email,
        full_name: credentials.name,
        role,
      });
      showToast('Role Switched', `Active role switched to ${credentials.name}`, 'info');
    }
  };

  const callNextPatient = async (specialtyFilter?: string) => {
    try {
      const called = await api.callNext(specialtyFilter);
      broadcastAudioChime(`Calling Token ${called.token_number} — ${called.patient_name} to ${called.room_number}`);
      showToast('Token Called', `${called.token_number} called to ${called.room_number}`, 'success');
      await refreshData();
    } catch (e: any) {
      // Fallback to local
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
    }
  };

  const updatePatientStatus = async (patientId: string, newStatus: QueueStatus) => {
    const item = queue.find(q => q.id === patientId);
    const numId = parseInt(patientId.replace('q-', ''), 10);
    const versionId = item?.version_id || 1;

    try {
      if (!isNaN(numId)) {
        await api.updateQueueStatus(numId, newStatus, versionId);
        await refreshData();
        showToast('Status Updated', `Patient queue status changed to ${newStatus}`, 'info');
        return;
      }
    } catch (err: any) {
      if (err.message && err.message.includes('409')) {
        showToast('Concurrency Conflict', 'Queue item was modified by another user. Reloading...', 'error');
        await refreshData();
        return;
      }
    }

    setQueue(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: newStatus, version_id: (p.version_id || 1) + 1 };
      }
      return p;
    }));
    showToast('Status Updated', `Patient queue status changed to ${newStatus}`, 'info');
  };

  const addNewAppointment = async (data: Omit<Appointment, 'id' | 'tokenNumber' | 'aiPredictedWaitMinutes' | 'status'>): Promise<Appointment> => {
    try {
      const created = await api.createAppointment({
        patient_name: data.patientName,
        patient_phone: data.patientPhone,
        mrn: data.mrn,
        specialty_name: data.specialty,
        doctor_name: data.doctorName,
        date: data.date,
        time_slot: data.timeSlot,
        urgency: data.urgency,
        notes: data.notes,
      });

      const newApt: Appointment = {
        id: String(created.id),
        tokenNumber: created.token_number,
        patientName: created.patient_name,
        patientPhone: created.patient_phone,
        mrn: created.mrn,
        specialty: created.specialty_name as SpecialtyType,
        doctorName: created.doctor_name,
        date: created.date,
        timeSlot: created.time_slot,
        urgency: created.urgency as any,
        status: created.status as any,
        aiPredictedWaitMinutes: created.ai_predicted_wait_minutes,
        notes: created.notes,
      };

      await refreshData();
      showToast('Appointment Booked', `Token ${created.token_number} generated for ${data.patientName}.`, 'success');
      return newApt;
    } catch {
      // Local fallback
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
          version_id: 1,
        };
        setQueue(prev => [...prev, newQueueItem]);
      }

      showToast('Appointment Booked', `Token ${tokenNumber} generated for ${data.patientName}.`, 'success');
      return newApt;
    }
  };

  const approveRecommendation = async (recId: string) => {
    if (currentUser.role !== 'admin') {
      showToast('Permission Denied', 'Only CMO / Administrators can approve AI schedule rebalancing.', 'error');
      return;
    }

    const numId = parseInt(recId.replace('ai-rec-', ''), 10);
    try {
      if (!isNaN(numId)) {
        await api.approveRecommendation(numId);
        await refreshData();
        showToast('AI Plan Enacted', 'Recommendation approved & queue rebalanced in database!', 'success');
        setIsAIApprovalModalOpen(false);
        return;
      }
    } catch (e: any) {
      if (e.message && e.message.includes('403')) {
        showToast('Permission Denied', 'Requires Administrator role.', 'error');
        return;
      }
    }

    // Local fallback
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Approved' } : r));

    if (recId === 'ai-rec-1' || recId === '1') {
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

      setDoctors(prev => prev.map(d => {
        if (d.name === 'Dr. Marcus Chen') return { ...d, workloadPercentage: 82 };
        if (d.name === 'Dr. Emily Vance') return { ...d, workloadPercentage: 74 };
        return d;
      }));
    }

    showToast('AI Plan Enacted', 'Recommendation approved & queue dynamically rebalanced.', 'success');
    setIsAIApprovalModalOpen(false);
  };

  const dismissRecommendation = async (recId: string) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Dismissed' } : r));
    showToast('Recommendation Dismissed', 'Recommendation archived without applying changes.', 'info');
    setIsAIApprovalModalOpen(false);
  };

  const admitEmergencyPatient = async (patient: { name: string; mrn: string; age: number; gender: 'M' | 'F' | 'Other'; specialty: SpecialtyType; condition: string }) => {
    try {
      const created = await api.admitEmergency({
        patient_name: patient.name,
        mrn: patient.mrn,
        age: patient.age,
        gender: patient.gender,
        specialty_name: patient.specialty,
        priority: 'Acute Priority',
        notes: patient.condition,
      });

      broadcastAudioChime(`Code Triage: Emergency Intake for ${patient.name} (${created.token_number}) in Triage Bay 1`);
      showToast('Emergency Admitted', `Token ${created.token_number} admitted with top priority.`, 'warning');
      await refreshData();
      setIsEmergencyModalOpen(false);
      return;
    } catch {
      // Local fallback
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
        version_id: 1,
      };

      setQueue(prev => [newQueueItem, ...prev]);
      broadcastAudioChime(`Code Triage: Emergency Intake for ${patient.name} (${tokenNumber}) in Triage Bay 1`);
      showToast('Emergency Admitted', `Token ${tokenNumber} admitted with top priority.`, 'warning');
      setIsEmergencyModalOpen(false);
    }
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
        currentUser,
        switchRole,
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
        refreshData,
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
