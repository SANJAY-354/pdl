import React from 'react';
import { useClinic } from '../../context/ClinicContext';

export const ToastNotification: React.FC = () => {
  const { toast, clearToast } = useClinic();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#1C1734] border-[#c7ee55] text-white',
    warning: 'bg-[#25203D] border-[#FFBF69] text-white',
    error: 'bg-[#25203D] border-[#FF6F91] text-white',
    info: 'bg-[#25203D] border-[#7657ff] text-white',
  }[toast.type];

  const iconName = {
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
    info: 'info',
  }[toast.type];

  const iconColor = {
    success: 'text-[#c7ee55]',
    warning: 'text-[#FFBF69]',
    error: 'text-[#FF6F91]',
    info: 'text-[#7657ff]',
  }[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in shadow-2xl">
      <div
        className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 backdrop-blur-md ${bgStyles}`}
      >
        <span className={`material-symbols-outlined text-2xl ${iconColor}`}>
          {iconName}
        </span>
        <div className="flex-1 pr-2">
          <h4 className="font-sans font-bold text-sm tracking-tight">{toast.title}</h4>
          <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{toast.desc}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-white/60 hover:text-white transition-colors p-1"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};
