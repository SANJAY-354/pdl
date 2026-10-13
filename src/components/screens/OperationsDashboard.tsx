import React from 'react';
import { useClinic } from '../../context/ClinicContext';

export const OperationsDashboard: React.FC = () => {
  const {
    queue,
    doctors,
    bays,
    recommendations,
    selectedSpecialty,
    searchQuery,
    setSelectedRecommendation,
    setIsAIApprovalModalOpen,
    setIsBookingDrawerOpen,
    callNextPatient,
    updatePatientStatus,
    showToast,
  } = useClinic();

  // Filtered queue
  const filteredQueue = queue.filter((p) => {
    const matchesSpecialty =
      selectedSpecialty === 'All' || p.specialty === selectedSpecialty;
    const matchesSearch =
      !searchQuery ||
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const waitingCount = queue.filter((p) => p.status === 'Waiting').length;
  const inConsultCount = queue.filter((p) => p.status === 'In Consultation').length;
  const activeRec = recommendations.find((r) => r.id === 'ai-rec-1') || recommendations[0];

  const handleOpenRec = () => {
    setSelectedRecommendation(activeRec);
    setIsAIApprovalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Headline View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[#797587] text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>MediFlow Core</span>
            <span>/</span>
            <span className="text-[#5d39e5] font-extrabold">Operations Dashboard</span>
          </div>
          <h2 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1c1734] tracking-tight">
            Clinic Operational Flow & AI Balancing
          </h2>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#E8E3F3] flex items-center gap-2 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-[#1c1734]">10:45 AM EST • Live Stream</span>
          </div>
          <button
            onClick={() => showToast('Simulated Feed Refreshed', 'Real-time queue and bay telemetry synchronized.', 'info')}
            className="p-2 bg-white border border-[#E8E3F3] rounded-xl hover:bg-[#F7F1FF] text-[#1c1734] transition-all shadow-xs"
            title="Refresh Live Sim"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </div>

      {/* 5 TOP KPI METRIC TILES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E3F3] shadow-card hover:shadow-lifted transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
              Appointments
            </span>
            <span className="material-symbols-outlined text-[#7657ff]">calendar_month</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-sans text-3xl font-extrabold text-[#1c1734] tracking-tight">142</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              +12% vs avg
            </span>
          </div>
          <p className="text-xs text-[#484555] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">trending_up</span>
            86 completed • 56 scheduled
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#7657ff]/30" />
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E3F3] shadow-card hover:shadow-lifted transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
              Patients Waiting
            </span>
            <span className="material-symbols-outlined text-[#FFBF69]">hourglass_top</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-sans text-3xl font-extrabold text-[#1c1734] tracking-tight">
              {waitingCount + 10}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
              Active Flow
            </span>
          </div>
          <p className="text-xs text-[#484555]">
            <strong className="text-[#1c1734] font-semibold">4</strong> in triage •{' '}
            <strong className="text-[#1c1734] font-semibold">{waitingCount + 6}</strong> in lounge
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFBF69]" />
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E3F3] shadow-card hover:shadow-lifted transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
              Predicted Avg Wait
            </span>
            <span className="material-symbols-outlined text-emerald-600">timer</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-sans text-3xl font-extrabold text-[#1c1734] tracking-tight">
              13.5<span className="text-sm font-normal text-[#484555] ml-0.5">min</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              -4.2m AI Opt
            </span>
          </div>
          <p className="text-xs text-[#484555]">Target SLA: &lt; 20 min peak</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E3F3] shadow-card hover:shadow-lifted transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
              Physician Load
            </span>
            <span className="material-symbols-outlined text-[#5d39e5]">stethoscope</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-sans text-3xl font-extrabold text-[#1c1734] tracking-tight">
              {activeRec.status === 'Approved' ? '82%' : '91%'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#e6deff] text-[#5d39e5] text-[11px] font-bold">
              12 of 14
            </span>
          </div>
          <p className="text-xs text-[#484555]">2 roaming floaters available</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5d39e5]" />
        </div>

        {/* KPI 5 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E3F3] shadow-card hover:shadow-lifted transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
              No-Show Risk
            </span>
            <span className="material-symbols-outlined text-[#506600]">crisis_alert</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-sans text-3xl font-extrabold text-[#1c1734] tracking-tight">3.8%</span>
            <span className="px-2 py-0.5 rounded-full bg-[#c7ee55] text-[#536b00] text-[11px] font-bold">
              Low Risk
            </span>
          </div>
          <p className="text-xs text-[#484555]">2 slots auto pre-filled</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#506600]" />
        </div>
      </section>

      {/* HERO AI FEATURE CARD: AI DYNAMIC SCHEDULE OPTIMIZER */}
      <section className="rounded-3xl p-6 lg:p-7 bg-gradient-to-br from-[#7657ff] via-[#4612cf] to-[#25203d] text-white shadow-xl relative overflow-hidden border border-[#c7ee55]/40 shimmer-active">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c7ee55]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#7657ff]/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#c7ee55] text-[#536b00] text-xs font-extrabold tracking-wide flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
                <span>AI AUTONOMOUS OPTIMIZATION</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#c9beff] text-[11px] font-bold backdrop-blur-xs border border-white/15">
                Simulated AI Demo • Admin Approval Required
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-bold border border-emerald-400/30">
                Confidence: {activeRec.confidenceScore}%
              </span>
            </div>

            <h3 className="font-sans text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              {activeRec.title}
            </h3>

            <p className="text-sm text-white/90 leading-relaxed">
              {activeRec.status === 'Approved' ? (
                <span className="text-[#c7ee55] font-semibold">
                  ✓ Optimization Enacted: 2 routine follow-ups rebalanced to Dr. Vance. Expected wait reduction (-16 min) currently in effect!
                </span>
              ) : (
                <>
                  Dr. Chen’s queue at 11:30 AM has an estimated{' '}
                  <span className="font-bold text-[#c7ee55]">22m delay</span> due to urgent pediatric asthma intake. MediFlow suggests shifting 2 routine follow-ups to{' '}
                  <span className="underline decoration-[#c7ee55] underline-offset-4 font-semibold text-white">
                    Dr. Vance
                  </span>{' '}
                  (Dermatology crossover/general room 4). Expected clinic wait reduction:{' '}
                  <strong className="text-[#c7ee55] font-extrabold">-{activeRec.impactMinutes} mins</strong>.
                </>
              )}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-[#c9c4d8]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#c7ee55]">verified_user</span>
                Pediatric SLA Compliance: 98.4%
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#42D6C5]">notifications_active</span>
                Automated SMS Parent Alerts Ready
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {activeRec.status === 'Approved' ? (
              <div className="px-5 py-3 rounded-2xl bg-white/15 border border-[#c7ee55] text-white flex items-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined text-[#c7ee55]">check_circle</span>
                <span>Plan Approved & Active</span>
              </div>
            ) : (
              <button
                onClick={handleOpenRec}
                className="px-6 py-3 rounded-2xl bg-[#c7ee55] text-[#536b00] hover:bg-[#caf158] font-sans font-extrabold text-sm shadow-lg shadow-[#c7ee55]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">check</span>
                <span>Simulate & Approve</span>
              </button>
            )}
            <button
              onClick={() => setIsBookingDrawerOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-sm backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>+ Manual Booking</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3-COLUMN SPLIT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COL 1: LIVE QUEUE FLOW (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#7657ff] text-2xl">queue</span>
              <div>
                <h3 className="font-sans font-extrabold text-base text-[#1c1734]">
                  Active Patient Queue & Triage Status
                </h3>
                <p className="text-xs text-[#797587]">
                  Real-time token routing and consultation timers
                </p>
              </div>
            </div>
            <button
              onClick={() => callNextPatient(selectedSpecialty)}
              className="px-3.5 py-1.5 rounded-xl bg-[#7657ff] text-white hover:bg-[#5d39e5] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">campaign</span>
              <span>Call Next Token</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E3F3] text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
                  <th className="py-2.5 px-3">Token / Patient</th>
                  <th className="py-2.5 px-3">Specialty</th>
                  <th className="py-2.5 px-3">Physician / Bay</th>
                  <th className="py-2.5 px-3">Predicted Wait</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3F3]/60 font-medium">
                {filteredQueue.slice(0, 7).map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F5FF] transition-colors group">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm text-[#7657ff]">
                          {item.tokenNumber}
                        </span>
                        <div>
                          <div className="font-bold text-[#1c1734] leading-tight">{item.patientName}</div>
                          <div className="text-[10px] text-[#797587]">{item.mrn} • {item.age}y/{item.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#F1EBFF] text-[#5d39e5] text-[11px] font-bold">
                        {item.specialty}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1c1734]">{item.doctorName}</div>
                      <div className="text-[10px] text-[#797587]">{item.roomNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-sans font-extrabold ${item.predictedWaitMinutes > 15 ? 'text-[#a92d51]' : 'text-emerald-700'}`}>
                          {item.status === 'In Consultation' ? 'In Exam' : `~${item.predictedWaitMinutes} min`}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#797587]">Elapsed: {item.elapsedWaitMinutes}m</span>
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
                    <td className="py-3 px-3 text-right">
                      {item.status === 'Waiting' && (
                        <button
                          onClick={() => updatePatientStatus(item.id, 'Calling')}
                          className="px-2.5 py-1 rounded-lg bg-[#F1EBFF] hover:bg-[#7657ff] text-[#7657ff] hover:text-white text-[11px] font-bold transition-all"
                        >
                          Call
                        </button>
                      )}
                      {item.status === 'Calling' && (
                        <button
                          onClick={() => updatePatientStatus(item.id, 'In Consultation')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[11px] font-bold transition-all"
                        >
                          Admit
                        </button>
                      )}
                      {item.status === 'In Consultation' && (
                        <button
                          onClick={() => updatePatientStatus(item.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-800 text-gray-700 hover:text-white text-[11px] font-bold transition-all"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COL 2: EXAM ROOMS & HOURLY AI PREDICTION (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Room Allocation Status */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
              <div>
                <h3 className="font-sans font-extrabold text-base text-[#1c1734]">
                  Clinic Bays & Rooms Live Status
                </h3>
                <p className="text-xs text-[#797587]">24 Total • 19 Occupied / Ready</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                79% Utilized
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {bays.slice(0, 6).map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    b.currentStatus === 'Occupied'
                      ? 'bg-[#F7F1FF] border-[#7657ff]/40 shadow-xs'
                      : b.currentStatus === 'Ready'
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : b.currentStatus === 'Cleaning'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans font-bold text-xs text-[#1c1734]">{b.bayNumber}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        b.currentStatus === 'Occupied'
                          ? 'bg-[#7657ff]'
                          : b.currentStatus === 'Ready'
                          ? 'bg-emerald-500'
                          : b.currentStatus === 'Cleaning'
                          ? 'bg-amber-500'
                          : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-[#5d39e5] truncate">{b.specialty}</div>
                  <div className="text-[10px] text-[#797587] truncate">{b.assignedDoctor}</div>
                  <div className="text-[10px] text-[#484555] mt-1 font-medium">{b.currentStatus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Wait-Time Curve / Hourly Forecast */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-extrabold text-base text-[#1c1734]">
                  AI Hourly Wait-Time Trajectory
                </h3>
                <p className="text-xs text-[#797587]">Target SLA: &lt; 20 min threshold</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#e6deff] text-[#5d39e5] text-[10px] font-extrabold uppercase">
                LSTM Forecast
              </span>
            </div>

            {/* Simulated bar trajectory chart */}
            <div className="space-y-2 pt-2">
              {[
                { time: '09:00 AM', wait: 9, status: 'ok' },
                { time: '10:00 AM', wait: 14, status: 'ok' },
                { time: '11:00 AM', wait: 24, status: 'breach', label: 'Pediatrics Rush' },
                { time: '12:00 PM', wait: 18, status: 'warning' },
                { time: '01:00 PM', wait: 11, status: 'ok' },
                { time: '02:00 PM', wait: 19, status: 'warning', label: 'Ortho Cluster' },
              ].map((slot) => (
                <div key={slot.time} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-semibold text-[#484555] text-[11px]">{slot.time}</span>
                  <div className="flex-1 bg-[#F1EBFF] h-4 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        slot.status === 'breach'
                          ? 'bg-[#FF6F91]'
                          : slot.status === 'warning'
                          ? 'bg-[#FFBF69]'
                          : 'bg-[#7657ff]'
                      }`}
                      style={{ width: `${Math.min(100, (slot.wait / 30) * 100)}%` }}
                    />
                  </div>
                  <span className="w-12 font-bold text-[#1c1734] text-right font-sans">
                    {slot.wait}m
                  </span>
                  {slot.label && (
                    <span className="text-[10px] font-bold text-[#a92d51] truncate w-24">
                      {slot.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
