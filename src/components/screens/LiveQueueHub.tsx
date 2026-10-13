import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { QueueStatus } from '../../types';

export const LiveQueueHub: React.FC = () => {
  const {
    queue,
    bays,
    selectedSpecialty,
    searchQuery,
    callNextPatient,
    updatePatientStatus,
    broadcastAudioChime,
    setIsEmergencyModalOpen,
    updateBayStatus,
    showToast,
  } = useClinic();

  const [statusFilter, setStatusFilter] = useState<'All' | QueueStatus>('All');
  const [isQueueHeld, setIsQueueHeld] = useState(false);

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSpecialty =
      selectedSpecialty === 'All' || item.specialty === selectedSpecialty;
    const matchesSearch =
      !searchQuery ||
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSpecialty && matchesSearch;
  });

  const allCount = queue.length;
  const inConsultCount = queue.filter((q) => q.status === 'In Consultation').length;
  const callingCount = queue.filter((q) => q.status === 'Calling').length;
  const waitingCount = queue.filter((q) => q.status === 'Waiting').length;
  const delayedCount = queue.filter((q) => q.status === 'Delayed').length;

  const handleCallNext = () => {
    if (isQueueHeld) {
      showToast('Queue is Paused', 'Queue is currently on hold. Unpause queue to call next patient.', 'warning');
      return;
    }
    callNextPatient(selectedSpecialty);
  };

  const toggleHoldQueue = () => {
    setIsQueueHeld(!isQueueHeld);
    showToast(
      isQueueHeld ? 'Queue Resumed' : 'Queue Held',
      isQueueHeld ? 'Live token routing resumed.' : 'Token calling temporarily paused for administrative hold.',
      isQueueHeld ? 'success' : 'warning'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Sync toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E3F3] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#5d39e5] tracking-wider uppercase mb-1">
            <span>MEDIFLOW CORE</span>
            <span className="text-[#C9C4D8]">/</span>
            <span className="text-[#484555]">LIVE QUEUE & ROOM FLOW</span>
          </div>
          <h1 className="font-sans text-2xl lg:text-3xl text-[#1C1734] font-extrabold tracking-tight flex items-center gap-3">
            <span>Live Clinic Queue & Room Assignment Hub</span>
            <span className="inline-flex items-center gap-1.5 bg-white text-[#484555] text-xs px-2.5 py-1 rounded-xl border border-[#E8E3F3] shadow-xs">
              <span className="material-symbols-outlined text-sm text-[#7657ff]">schedule</span>
              <span>10:48 AM EST</span>
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#484555] mt-1">
            Real-time multi-specialty patient intake, automated room routing, and dynamic token orchestration.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => showToast('Queue Re-synchronized', 'Live queue socket feed refreshed.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E3F3] text-[#1C1734] text-xs font-bold hover:bg-[#F7F1FF] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base text-[#7657ff]">refresh</span>
            <span>Sync</span>
          </button>
          <button
            onClick={() => showToast('Routing Rules Active', 'Priority sorting: Acute > Urgent > Routine with SLA capping.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E3F3] text-[#1C1734] text-xs font-bold hover:bg-[#F7F1FF] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">settings_ethernet</span>
            <span>Routing Rules</span>
          </button>
        </div>
      </div>

      {/* QUEUE CONTROL TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E3F3] shadow-card flex flex-wrap items-center justify-between gap-4">
        {/* Status Pill Segments */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'All', label: `All (${allCount})` },
            { id: 'In Consultation', label: `In Consultation (${inConsultCount})` },
            { id: 'Calling', label: `Calling (${callingCount})` },
            { id: 'Waiting', label: `Waiting (${waitingCount})` },
            { id: 'Delayed', label: `Delayed (${delayedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as 'All' | QueueStatus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#7657ff] text-white shadow-xs'
                  : 'bg-[#F7F1FF] hover:bg-[#ECE4FF] text-[#484555]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Master Queue Commands */}
        <div className="flex items-center gap-2.5">
          {/* Call Next Token */}
          <button
            onClick={handleCallNext}
            className="px-4 py-2 rounded-xl bg-[#5d39e5] text-white text-xs font-bold hover:bg-[#7657ff] shadow-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">campaign</span>
            <span>Call Next Token</span>
          </button>

          {/* Audio Chime Broadcast */}
          <button
            onClick={() => broadcastAudioChime('Attention in Waiting Lounge: Next tokens for Cardiology and Pediatrics please proceed to Room 101 and Room 202.')}
            className="px-3.5 py-2 rounded-xl bg-[#F7F1FF] hover:bg-[#ECE4FF] text-[#1C1734] border border-[#E8E3F3] text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Broadcast Audio Announcement"
          >
            <span className="material-symbols-outlined text-lg text-[#7657ff]">volume_up</span>
            <span className="hidden sm:inline">Broadcast Announcement</span>
          </button>

          {/* Hold Queue Toggle */}
          <button
            onClick={toggleHoldQueue}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isQueueHeld
                ? 'bg-[#FFBF69] text-[#25203D] border-[#FFBF69]'
                : 'bg-[#FFF8EE] text-[#C47C10] border-[#FFBF69]/40 hover:bg-[#FFEECB]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {isQueueHeld ? 'play_arrow' : 'pause_circle'}
            </span>
            <span>{isQueueHeld ? 'Resume Queue' : 'Hold Queue'}</span>
          </button>

          {/* Emergency Override */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FFF0F4] text-[#a92d51] border border-[#ca4669]/30 hover:bg-[#ca4669]/20 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-lg text-[#ca4669]">crisis_alert</span>
            <span>Emergency Intake</span>
          </button>
        </div>
      </div>

      {/* MAIN QUEUE TABLE & ROOM ASSIGNMENT DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* QUEUE TABLE (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Active Token Manifest ({filteredQueue.length} Active Patients)
            </h3>
            <span className="text-xs text-[#797587]">
              Specialty: <strong className="text-[#1C1734]">{selectedSpecialty}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E3F3] text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
                  <th className="py-2.5 px-3">Token</th>
                  <th className="py-2.5 px-3">Patient & MRN</th>
                  <th className="py-2.5 px-3">Specialty</th>
                  <th className="py-2.5 px-3">Triage Priority</th>
                  <th className="py-2.5 px-3">Doctor & Room</th>
                  <th className="py-2.5 px-3">Wait Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3F3]/60 font-medium">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F5FF] transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-sans font-extrabold text-sm text-[#7657ff]">
                        {item.tokenNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1C1734]">{item.patientName}</div>
                      <div className="text-[10px] text-[#797587]">{item.mrn} • {item.age}y/{item.gender}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#F1EBFF] text-[#5d39e5] text-[11px] font-bold">
                        {item.specialty}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.priority === 'Acute Priority'
                            ? 'bg-red-100 text-red-900 border border-red-300'
                            : item.priority === 'Urgent'
                            ? 'bg-amber-100 text-amber-900'
                            : item.priority === 'VIP'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1C1734]">{item.doctorName}</div>
                      <div className="text-[10px] text-[#797587]">{item.roomNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-extrabold text-xs text-[#1C1734]">
                        {item.status === 'In Consultation' ? 'Active Exam' : `~${item.predictedWaitMinutes}m pred`}
                      </div>
                      <div className="text-[10px] text-[#797587]">Elapsed: {item.elapsedWaitMinutes}m</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'In Consultation'
                            ? 'bg-purple-100 text-purple-900'
                            : item.status === 'Calling'
                            ? 'bg-[#c7ee55] text-[#536b00] animate-pulse'
                            : item.status === 'Delayed'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      {item.status === 'Waiting' && (
                        <button
                          onClick={() => updatePatientStatus(item.id, 'Calling')}
                          className="px-2.5 py-1 rounded-lg bg-[#7657ff] text-white hover:bg-[#5d39e5] text-[11px] font-bold"
                        >
                          Call
                        </button>
                      )}
                      {item.status === 'Calling' && (
                        <button
                          onClick={() => updatePatientStatus(item.id, 'In Consultation')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold"
                        >
                          Admit
                        </button>
                      )}
                      {item.status === 'In Consultation' && (
                        <button
                          onClick={() => updatePatientStatus(item.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 text-[11px] font-bold"
                        >
                          Finish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROOM ASSIGNMENTS PANEL (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
              <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
                Exam Room & Bay Allocation
              </h3>
              <span className="text-xs font-bold text-[#5d39e5]">12 Active Wings</span>
            </div>

            <div className="space-y-3">
              {bays.map((bay) => (
                <div
                  key={bay.id}
                  className="p-3.5 rounded-2xl border border-[#E8E3F3] bg-[#F7F5FF] hover:bg-white hover:shadow-xs transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-extrabold text-xs text-[#1C1734]">
                        {bay.bayNumber}
                      </span>
                      <span className="text-[10px] font-bold text-[#797587]">
                        ({bay.wing})
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          bay.currentStatus === 'Occupied'
                            ? 'bg-purple-100 text-purple-900'
                            : bay.currentStatus === 'Ready'
                            ? 'bg-emerald-100 text-emerald-900'
                            : bay.currentStatus === 'Cleaning'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {bay.currentStatus}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#5d39e5]">{bay.specialty}</div>
                    <div className="text-[11px] text-[#484555]">
                      Assigned: {bay.assignedDoctor}
                    </div>
                    {bay.currentPatientToken && (
                      <div className="text-[10px] font-semibold text-[#a92d51]">
                        Current Token: {bay.currentPatientToken}
                      </div>
                    )}
                    <div className="text-[10px] text-[#797587]">{bay.equipmentStatus}</div>
                  </div>

                  {/* Quick Toggle Action */}
                  <div className="flex flex-col gap-1 shrink-0">
                    {bay.currentStatus === 'Cleaning' ? (
                      <button
                        onClick={() => updateBayStatus(bay.id, 'Ready')}
                        className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[10px] font-bold transition-colors"
                      >
                        Mark Ready
                      </button>
                    ) : bay.currentStatus === 'Ready' ? (
                      <button
                        onClick={() => updateBayStatus(bay.id, 'Occupied')}
                        className="px-2 py-1 rounded-lg bg-[#F1EBFF] hover:bg-[#7657ff] text-[#7657ff] hover:text-white text-[10px] font-bold transition-colors"
                      >
                        Occupy
                      </button>
                    ) : (
                      <button
                        onClick={() => updateBayStatus(bay.id, 'Cleaning')}
                        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white text-[10px] font-bold transition-colors"
                      >
                        Clean
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
