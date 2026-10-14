const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mediflow-ai-iqnd.onrender.com/api/v1';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('mediflow_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => apiRequest<any>('/auth/me'),

  // Queue
  getQueue: (specialty?: string, status?: string) => {
    const params = new URLSearchParams();
    if (specialty && specialty !== 'All') params.append('specialty', specialty);
    if (status && status !== 'All') params.append('status', status);
    return apiRequest<any[]>(`/queue?${params.toString()}`);
  },
  callNext: (specialty?: string) => {
    const params = new URLSearchParams();
    if (specialty && specialty !== 'All') params.append('specialty', specialty);
    return apiRequest<any>(`/queue/call-next?${params.toString()}`, { method: 'POST' });
  },
  updateQueueStatus: (id: number, status: string, versionId: number) =>
    apiRequest<any>(`/queue/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, version_id: versionId }),
    }),
  admitEmergency: (data: any) =>
    apiRequest<any>('/queue/emergency', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Appointments
  getAppointments: (specialty?: string, status?: string) => {
    const params = new URLSearchParams();
    if (specialty && specialty !== 'All') params.append('specialty', specialty);
    if (status && status !== 'All') params.append('status', status);
    return apiRequest<any[]>(`/appointments?${params.toString()}`);
  },
  createAppointment: (data: any) =>
    apiRequest<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Doctors & Bays
  getDoctors: () => apiRequest<any[]>('/doctors'),
  getSpecialties: () => apiRequest<any[]>('/specialties'),
  getBays: () => apiRequest<any[]>('/bays'),

  // AI & ML
  getRecommendations: () => apiRequest<any[]>('/ai/recommendations'),
  approveRecommendation: (id: number, notes?: string) =>
    apiRequest<any>(`/ai/recommendations/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
  predictWaitTime: (data: any) =>
    apiRequest<any>('/ai/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Notifications
  getNotifications: () => apiRequest<any[]>('/notifications'),

  // Modular Integrations (Audio, SMS/WhatsApp, FHIR)
  getIntegrationsStatus: () => apiRequest<any>('/integrations/status'),
  dispatchNotification: (to_phone: string, message: string, channel: 'sms' | 'whatsapp' = 'sms') =>
    apiRequest<any>('/integrations/notifications/dispatch', {
      method: 'POST',
      body: JSON.stringify({ to_phone, message, channel }),
    }),
  broadcastAudio: (token_number: string, room_number: string, text?: string) =>
    apiRequest<any>('/integrations/audio/broadcast', {
      method: 'POST',
      body: JSON.stringify({ token_number, room_number, text }),
    }),
  lookupFhirPatient: (mrn: string) => apiRequest<any>(`/integrations/fhir/patient/${encodeURIComponent(mrn)}`),
  exportAppointmentToFhir: (appointmentId: number) =>
    apiRequest<any>(`/integrations/fhir/appointment/${appointmentId}`),
};

