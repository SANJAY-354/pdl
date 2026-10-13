import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Doctor } from '../../types';

export const StaffSchedule: React.FC = () => {
  const { doctors, updateDoctorStatus, selectedSpecialty, showToast, setIsAIApprovalModalOpen, setSelectedRecommendation, recommendations } = useClinic();

  const [shiftFilter, setShiftFilter] = useState<'All' | 'On Duty' | 'In Consultation' | 'Available' | 'On Break'>('All');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesShift =
      shiftFilter === 'All' ||
      (shiftFilter === 'On Duty' && doc.status !== 'Off Duty') ||
      doc.status === shiftFilter;
    return matchesSpecialty && matchesShift;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E3F3] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#5d39e5] tracking-wider uppercase mb-1">
            <span>MEDIFLOW CORE</span>
            <span className="text-[#C9C4D8]">/</span>
            <span className="text-[#484555]">PHYSICIANS & CLINICAL ROSTER</span>
          </div>
          <h1 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1C1734] tracking-tight">
            Doctors & Staff Schedule & Workload Allocation
          </h1>
          <p className="text-xs sm:text-sm text-[#484555] mt-1">
            Real-time practitioner availability, consultation capacity balancing, and floating coverage coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRecommendation(recommendations[0]);
              setIsAIApprovalModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#c7ee55] hover:bg-[#caf158] text-[#536b00] text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>AI Workload Rebalance</span>
          </button>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E3F3] shadow-card">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'On Duty', 'In Consultation', 'Available', 'On Break'].map((filter) => (
            <button
              key={filter}
              onClick={() => setShiftFilter(filter as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                shiftFilter === filter
                  ? 'bg-[#7657ff] text-white shadow-xs'
                  : 'bg-[#F7F1FF] text-[#484555] hover:bg-[#ECE4FF]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#797587]">
          Showing <strong className="text-[#1C1734]">{filteredDoctors.length}</strong> active staff members
        </span>
      </div>

      {/* DOCTORS ROSTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => {
          const isHighWorkload = doc.workloadPercentage >= 85;
          const isModerateWorkload = doc.workloadPercentage >= 65 && doc.workloadPercentage < 85;

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card hover:shadow-lifted transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#7657ff]/40 shrink-0 shadow-xs">
                    <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                    <span
                      className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        doc.status === 'In Consultation'
                          ? 'bg-[#7657ff]'
                          : doc.status === 'Available'
                          ? 'bg-emerald-500'
                          : doc.status === 'On Break'
                          ? 'bg-[#FFBF69]'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h3 className="font-sans font-extrabold text-base text-[#1C1734] truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#5d39e5]">{doc.specialty}</p>
                    <p className="text-[11px] text-[#797587] truncate">{doc.role}</p>
                  </div>
                </div>

                {/* Badges & Shift Info */}
                <div className="mt-4 pt-3 border-t border-[#E8E3F3] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#797587] block">
                      Room / Bay
                    </span>
                    <span className="font-bold text-[#1C1734]">{doc.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#797587] block">
                      Shift Hours
                    </span>
                    <span className="font-semibold text-[#1C1734] text-[11px]">{doc.shiftHours}</span>
                  </div>
                </div>

                {/* Current Patient & Stats */}
                <div className="mt-3 p-3 rounded-xl bg-[#F7F5FF] border border-[#E8E3F3] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#797587] block">Patients Seen:</span>
                    <span className="font-sans font-extrabold text-sm text-[#1C1734]">
                      {doc.patientsSeenToday}
                    </span>
                  </div>
                  {doc.currentPatientToken ? (
                    <div className="text-right">
                      <span className="text-[10px] text-[#797587] block">Current Token:</span>
                      <span className="font-sans font-extrabold text-xs text-[#a92d51]">
                        {doc.currentPatientToken}
                      </span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] text-[#797587] block">Current Token:</span>
                      <span className="font-sans font-bold text-xs text-emerald-600">
                        Room Available
                      </span>
                    </div>
                  )}
                </div>

                {/* Workload Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-[#484555]">Capacity Load:</span>
                    <span
                      className={`font-sans font-extrabold ${
                        isHighWorkload
                          ? 'text-[#a92d51]'
                          : isModerateWorkload
                          ? 'text-[#506600]'
                          : 'text-[#5d39e5]'
                      }`}
                    >
                      {doc.workloadPercentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E8E3F3] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighWorkload
                          ? 'bg-[#FF6F91]'
                          : isModerateWorkload
                          ? 'bg-[#c7ee55]'
                          : 'bg-[#7657ff]'
                      }`}
                      style={{ width: `${doc.workloadPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-[#E8E3F3] flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#797587]">Status:</span>
                <select
                  value={doc.status}
                  onChange={(e) => updateDoctorStatus(doc.id, e.target.value as Doctor['status'])}
                  className="px-2.5 py-1 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-bold text-[#1C1734]"
                >
                  <option value="In Consultation">In Consultation</option>
                  <option value="Available">Available</option>
                  <option value="On Break">On Break</option>
                  <option value="Roaming Floater">Roaming Floater</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
