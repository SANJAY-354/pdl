import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';

export const AppointmentBooking: React.FC = () => {
  const {
    appointments,
    setIsBookingDrawerOpen,
    searchQuery,
    selectedSpecialty,
    showToast,
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'In Queue' | 'Arrived' | 'Completed'>('All');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab = activeTab === 'All' || apt.status === activeTab;
    const matchesSpecialty =
      selectedSpecialty === 'All' || apt.specialty === selectedSpecialty;
    const matchesSearch =
      !searchQuery ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSpecialty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Section Title */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8E3F3]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c7ee55] text-[#536b00] text-[11px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#536b00]" />
                AI Slot Recommendation Engine v4.8
              </span>
              <span className="text-[#797587] text-xs">• Regional Health Cardiology & Multi-Clinic</span>
            </div>
            <h1 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1C1734] tracking-tight">
              Specialty-Aware Appointment Booking & Dynamic Flow Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#484555] mt-1 max-w-3xl">
              Simulate and schedule clinical appointments with AI wait-time prediction, doctor workload balancing, and instant standby slot allocation.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsBookingDrawerOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#7657ff] hover:bg-[#5d39e5] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7657ff]/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>+ New Appointment</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Clinical Stepper Preview */}
        <nav aria-label="Booking Progress" className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">check</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                Step 01 • Done
              </span>
              <span className="font-sans font-bold text-xs text-[#1C1734]">
                Patient Identification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">check</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                Step 02 • Done
              </span>
              <span className="font-sans font-bold text-xs text-[#1C1734]">
                Specialty & Routing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border-2 border-[#7657ff] shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#7657ff] text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase text-[#7657ff] tracking-wider">
                Step 03 • Active
              </span>
              <span className="font-sans font-bold text-xs text-[#1C1734]">
                AI Slot & Physician Match
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3]">
            <div className="w-9 h-9 rounded-full bg-[#E8E3F3] text-[#797587] flex items-center justify-center font-bold text-xs">
              04
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase text-[#797587] tracking-wider">
                Step 04 • Queue Pass
              </span>
              <span className="font-sans font-bold text-xs text-[#797587]">
                Digital Pass & SMS
              </span>
            </div>
          </div>
        </nav>
      </div>

      {/* APPOINTMENT MANIFEST / TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E8E3F3]">
          <div className="flex items-center gap-2">
            {['All', 'In Queue', 'Arrived', 'Confirmed', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-[#7657ff] text-white shadow-xs'
                    : 'bg-[#F7F1FF] text-[#484555] hover:bg-[#ECE4FF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#797587]">
            Showing <strong className="text-[#1C1734]">{filteredAppointments.length}</strong> appointments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E3F3] text-[11px] font-extrabold uppercase text-[#797587] tracking-wider">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Patient Details</th>
                <th className="py-2.5 px-3">Specialty</th>
                <th className="py-2.5 px-3">Assigned Doctor</th>
                <th className="py-2.5 px-3">Time Slot</th>
                <th className="py-2.5 px-3">AI Wait Estimate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3F3]/60 font-medium">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#F7F5FF] transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-sans font-extrabold text-sm text-[#7657ff]">
                      {apt.tokenNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#1C1734]">{apt.patientName}</div>
                    <div className="text-[10px] text-[#797587]">
                      {apt.mrn} • {apt.patientPhone}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#F1EBFF] text-[#5d39e5] text-[11px] font-bold">
                      {apt.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#1C1734]">{apt.doctorName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#1C1734]">{apt.timeSlot}</div>
                    <div className="text-[10px] text-[#797587]">{apt.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-sans font-bold text-xs text-emerald-700">
                      ~{apt.aiPredictedWaitMinutes} min
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'In Queue'
                          ? 'bg-purple-100 text-purple-900'
                          : apt.status === 'Arrived'
                          ? 'bg-emerald-100 text-emerald-900'
                          : apt.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() =>
                        showToast(
                          'SMS Dispatched',
                          `Status reminder sent to ${apt.patientPhone} for token ${apt.tokenNumber}`,
                          'success'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#F7F1FF] hover:bg-[#7657ff] text-[#7657ff] hover:text-white text-[11px] font-bold transition-all"
                    >
                      Resend SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
