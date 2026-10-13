import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';

type RoleConfig = {
  role: 'admin' | 'doctor' | 'receptionist';
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
};

const ROLES: RoleConfig[] = [
  {
    role: 'admin',
    label: 'CMO / Admin',
    shortLabel: 'Admin',
    icon: 'shield_person',
    color: 'text-[#7657FF]',
    bg: 'bg-[#EDE8FF]',
    border: 'border-[#7657FF]/30',
  },
  {
    role: 'doctor',
    label: 'Dr. Chen (Doctor)',
    shortLabel: 'Doctor',
    icon: 'stethoscope',
    color: 'text-[#42D6C5]',
    bg: 'bg-[#E0FAF7]',
    border: 'border-[#42D6C5]/30',
  },
  {
    role: 'receptionist',
    label: 'Receptionist',
    shortLabel: 'Staff',
    icon: 'badge',
    color: 'text-[#FFBF69]',
    bg: 'bg-[#FFF6E6]',
    border: 'border-[#FFBF69]/40',
  },
];

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useClinic();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeConfig = ROLES.find((r) => r.role === currentUser?.role) ?? ROLES[0];

  const handleSwitch = async (role: 'admin' | 'doctor' | 'receptionist') => {
    if (role === currentUser?.role) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    setOpen(false);
    try {
      await switchRole(role);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={switching}
        title="Switch role"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${activeConfig.bg} ${activeConfig.border} ${activeConfig.color} transition-all hover:opacity-80 active:scale-95 shrink-0`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {switching ? (
          <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-base">{activeConfig.icon}</span>
        )}
        <span className="text-xs font-bold hidden sm:inline">{activeConfig.shortLabel}</span>
        <span className="material-symbols-outlined text-sm opacity-60">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E8E3F3] z-50 overflow-hidden animate-fade-in"
          role="listbox"
          aria-label="Select role"
        >
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[10px] font-bold text-[#797587] uppercase tracking-wider">
              Switch Role (Demo)
            </p>
          </div>
          <div className="py-1">
            {ROLES.map((rc) => {
              const isActive = currentUser?.role === rc.role;
              return (
                <button
                  key={rc.role}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSwitch(rc.role)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? `${rc.bg} ${rc.color}`
                      : 'text-[#484555] hover:bg-[#F7F5FF]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${isActive ? rc.color : 'text-[#797587]'}`}
                  >
                    {rc.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{rc.label}</p>
                    <p className="text-[10px] text-[#797587] capitalize">{rc.role}</p>
                  </div>
                  {isActive && (
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-[#E8E3F3]">
            <p className="text-[9px] text-[#B0A8C8] text-center">
              Role determines feature access
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
