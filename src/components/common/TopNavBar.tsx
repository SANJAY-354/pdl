import React from 'react';
import { useClinic, RouteType } from '../../context/ClinicContext';
import { RoleSwitcher } from './RoleSwitcher';

const specialtiesList = [
  'All',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Ophthalmology',
];

export const TopNavBar: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    setIsBookingDrawerOpen,
    setIsEmergencyModalOpen,
    setCurrentRoute,
    notifications,
  } = useClinic();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md shadow-xs border-b border-[#E8E3F3]">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 py-3 gap-3 md:gap-4">
        {/* Mobile Hamburger & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-2 rounded-xl text-[#1C1734] hover:bg-[#F7F1FF] md:hidden"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#797587] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name, MRN token, doctor or clinic room..."
              className="w-full pl-10 pr-12 py-2 bg-[#F7F1FF] border border-[#C9C4D8]/50 rounded-xl font-sans text-sm text-[#1C1734] placeholder:text-[#797587] focus:outline-none focus:border-[#7657ff] focus:ring-2 focus:ring-[#7657ff]/20 transition-all"
            />
            <div className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-bold text-[#797587] bg-white px-1.5 py-0.5 rounded border border-[#C9C4D8]/60 shadow-2xs">
              <span>⌘</span><span>K</span>
            </div>
          </div>

          {/* Live Realtime Sync Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wide">Live Sync: Active</span>
          </div>
        </div>

        {/* Right Side Nav Actions & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Emergency Triage Trigger */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ca4669]/15 text-[#a92d51] hover:bg-[#a92d51] hover:text-white font-sans text-xs sm:text-sm font-bold transition-all active:scale-95 border border-[#ca4669]/25"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">crisis_alert</span>
            <span className="hidden sm:inline">Emergency Triage</span>
            <span className="sm:hidden">Triage</span>
          </button>

          {/* Primary CTA: New Booking */}
          <button
            onClick={() => setIsBookingDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#7657ff] text-white hover:bg-[#5d39e5] active:scale-95 transition-all shadow-sm shadow-[#7657ff]/30 font-sans text-xs sm:text-sm font-bold"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">add</span>
            <span>New Booking</span>
          </button>

          {/* Icon Action Cluster */}
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-[#C9C4D8]/40">
            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Notifications */}
            <button
              onClick={() => setCurrentRoute('settings')}
              className="relative p-2 rounded-xl text-[#484555] hover:bg-[#ECE4FF] transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ca4669] ring-2 ring-white" />
              )}
            </button>
            <button
              onClick={() => setCurrentRoute('settings')}
              className="p-2 rounded-xl text-[#484555] hover:bg-[#ECE4FF] transition-colors hidden sm:flex"
              title="Clinic Tuning"
            >
              <span className="material-symbols-outlined text-xl">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specialty Quick Selector Tabs Bar */}
      <div className="px-4 md:px-8 py-2 border-t border-[#E8E3F3] flex items-center gap-2 overflow-x-auto bg-[#FFFFFF]">
        <span className="text-[11px] font-bold text-[#797587] uppercase tracking-wider shrink-0 mr-1">
          Specialty:
        </span>
        {specialtiesList.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#7657ff] text-white shadow-xs'
                  : 'bg-[#F1EBFF] hover:bg-[#ECE4FF] text-[#484555]'
              }`}
            >
              {spec === 'All' ? 'All Specialties' : spec}
            </button>
          );
        })}
      </div>
    </header>
  );
};
