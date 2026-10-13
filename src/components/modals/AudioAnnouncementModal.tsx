import React from 'react';
import { useClinic } from '../../context/ClinicContext';

export const AudioAnnouncementModal: React.FC = () => {
  const { isAudioModalOpen, setIsAudioModalOpen, activeAnnouncementText } = useClinic();

  if (!isAudioModalOpen) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-bounce-in">
      <div className="bg-[#25203D] text-white p-5 rounded-2xl border-2 border-[#D7FF64] shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#D7FF64] text-[#25203D] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl animate-pulse">volume_up</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-[#D7FF64] text-[#25203D] text-[10px] font-extrabold uppercase">
                Clinic Audio Chime
              </span>
              <span className="text-[11px] text-[#c9c4d8]">Lounge Speaker Broadcast</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {activeAnnouncementText || 'Calling Token #CARD-104 to Consultation Room 101'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAudioModalOpen(false)}
          className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};
