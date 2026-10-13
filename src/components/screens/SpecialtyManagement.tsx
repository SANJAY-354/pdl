import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { SpecialtyType } from '../../types';

export const SpecialtyManagement: React.FC = () => {
  const { bays, updateBayStatus, showToast, setIsAIApprovalModalOpen, setSelectedRecommendation, recommendations } = useClinic();

  const wings = [
    { name: 'Wing A', specialty: 'Cardiology' as SpecialtyType, lead: 'Dr. Sarah Lin', rooms: bays.filter(b => b.wing === 'Wing A') },
    { name: 'Wing C', specialty: 'Pediatrics' as SpecialtyType, lead: 'Dr. Marcus Chen', rooms: bays.filter(b => b.wing === 'Wing C') },
    { name: 'Wing B', specialty: 'Dermatology' as SpecialtyType, lead: 'Dr. Emily Vance', rooms: bays.filter(b => b.wing === 'Wing B') },
    { name: 'Wing D', specialty: 'Orthopedics' as SpecialtyType, lead: 'Dr. Rajesh Patel', rooms: bays.filter(b => b.wing === 'Wing D') },
    { name: 'Wing E', specialty: 'Ophthalmology' as SpecialtyType, lead: 'Dr. Sophia Rossi', rooms: bays.filter(b => b.wing === 'Wing E') },
  ];

  const handleAutoBalance = () => {
    const rec = recommendations[0];
    setSelectedRecommendation(rec);
    setIsAIApprovalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#5d39e5] tracking-wider uppercase mb-1">
            <span>MEDIFLOW CORE</span>
            <span className="text-[#C9C4D8]">/</span>
            <span className="text-[#484555]">CLINICAL SPECIALTIES & BAY INFRASTRUCTURE</span>
          </div>
          <h1 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1C1734] tracking-tight">
            Specialty Management & Bay Allocation
          </h1>
          <p className="text-xs sm:text-sm text-[#484555] mt-1 max-w-3xl">
            Multi-department capacity orchestration, dedicated exam rooms, physician workload tracking, and dynamic cross-cover triage.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAutoBalance}
            className="px-4 py-2.5 rounded-xl bg-[#c7ee55] hover:bg-[#caf158] text-[#536b00] font-sans text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>Auto-Balance Capacities (AI)</span>
          </button>
          <button
            onClick={() => showToast('Report Exported', 'Clinic bay utilization metrics downloaded as CSV.', 'success')}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E8E3F3] hover:bg-[#F7F1FF] text-[#1C1734] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 5 TOP METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3F3] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#797587]">Total Clinic Bays</span>
            <span className="w-8 h-8 rounded-lg bg-[#F1EBFF] flex items-center justify-center text-[#5d39e5]">
              <span className="material-symbols-outlined text-lg">meeting_room</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-extrabold text-[#1C1734]">24 Bays</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#c7ee55] text-[#536b00]">
                79% Utilized
              </span>
            </div>
            <p className="text-xs text-[#797587] mt-1">19 Active • 3 Res • 2 Maint</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3F3] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#797587]">Active Exam Rooms</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-lg">door_open</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-extrabold text-[#1C1734]">19 / 24</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Optimal
              </span>
            </div>
            <p className="text-xs text-[#797587] mt-1">Peak intake buffer ready</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3F3] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#797587]">Physicians On Duty</span>
            <span className="w-8 h-8 rounded-lg bg-[#F1EBFF] flex items-center justify-center text-[#5d39e5]">
              <span className="material-symbols-outlined text-lg">group</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-extrabold text-[#1C1734]">12 Specialists</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                100% Shift
              </span>
            </div>
            <p className="text-xs text-[#797587] mt-1">2 roaming floaters ready</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3F3] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#797587]">Cross-Cover Ready</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-lg">swap_horiz</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-extrabold text-[#1C1734]">3 Rooms</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                Dual-Use
              </span>
            </div>
            <p className="text-xs text-[#797587] mt-1">Peds / Derm crossover</p>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3F3] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#797587]">Peak Delay Risk</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-lg">warning</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-extrabold text-[#1C1734]">Pediatrics</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                High Surge
              </span>
            </div>
            <p className="text-xs text-[#797587] mt-1">AI loan recommendation active</p>
          </div>
        </div>
      </div>

      {/* SPECIALTY WINGS WITH BAY GRIDS */}
      <div className="space-y-6">
        {wings.map((wing) => (
          <div key={wing.name} className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E3F3]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#F1EBFF] text-[#5d39e5] flex items-center justify-center font-bold text-sm">
                  {wing.name.split(' ')[1]}
                </span>
                <div>
                  <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
                    {wing.specialty} Department ({wing.name})
                  </h3>
                  <p className="text-xs text-[#797587]">
                    Clinical Lead: <strong className="text-[#1C1734]">{wing.lead}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#484555]">
                  {wing.rooms.length} Exam Rooms Assigned
                </span>
              </div>
            </div>

            {/* Bays in Wing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wing.rooms.map((bay) => (
                <div
                  key={bay.id}
                  className="p-4 rounded-2xl border border-[#E8E3F3] bg-[#F7F5FF] hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-extrabold text-sm text-[#1C1734]">
                        {bay.bayNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <div className="text-xs font-bold text-[#5d39e5]">
                      Assigned: {bay.assignedDoctor}
                    </div>
                    {bay.currentPatientToken && (
                      <div className="text-xs font-semibold text-[#a92d51]">
                        Current Token: {bay.currentPatientToken}
                      </div>
                    )}
                    <div className="text-[11px] text-[#797587]">{bay.equipmentStatus}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E3F3]/60">
                    <button
                      onClick={() =>
                        updateBayStatus(
                          bay.id,
                          bay.currentStatus === 'Ready' ? 'Occupied' : 'Ready'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E3F3] hover:bg-[#F1EBFF] text-[#1C1734] text-[11px] font-bold transition-all"
                    >
                      {bay.currentStatus === 'Ready' ? 'Mark Occupied' : 'Set Ready'}
                    </button>
                    <button
                      onClick={() => updateBayStatus(bay.id, 'Cleaning')}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-all"
                    >
                      Request Clean
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
