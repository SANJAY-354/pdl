import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { IntegrationConsole } from './IntegrationConsole';

export const ClinicSettings: React.FC = () => {
  const { notifications, settings, updateSettings, showToast } = useClinic();

  const [filterType, setFilterType] = useState<'all' | 'urgent' | 'ai' | 'warning' | 'info'>('all');
  const [localSettings, setLocalSettings] = useState(settings);

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8E3F3] pb-5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#5d39e5] tracking-wider uppercase mb-1">
          <span>MEDIFLOW CORE</span>
          <span className="text-[#C9C4D8]">/</span>
          <span className="text-[#484555]">CONTROL CENTER & NOTIFICATIONS</span>
        </div>
        <h1 className="font-sans text-2xl lg:text-3xl font-extrabold text-[#1C1734] tracking-tight">
          Clinic Settings & Alert Notification Center
        </h1>
        <p className="text-xs sm:text-sm text-[#484555] mt-1">
          Manage system notifications, clinical wait-time thresholds, and administrative approval policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ALERT NOTIFICATION CENTER (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E3F3]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7657ff] text-xl">notifications</span>
              <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
                Live Clinic Alert Feed
              </h3>
            </div>
            <button
              onClick={() => showToast('All Cleared', 'Notifications marked as acknowledged.', 'info')}
              className="text-xs font-bold text-[#5d39e5] hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'urgent', 'ai', 'warning', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filterType === f
                    ? 'bg-[#7657ff] text-white'
                    : 'bg-[#F7F1FF] text-[#484555] hover:bg-[#ECE4FF]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3 pt-2">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  notif.type === 'urgent'
                    ? 'bg-[#FFF0F4] border-[#FF6F91]/30'
                    : notif.type === 'ai'
                    ? 'bg-[#F7F5FF] border-[#c7ee55]/60'
                    : notif.type === 'warning'
                    ? 'bg-[#FFF8EE] border-[#FFBF69]/40'
                    : 'bg-white border-[#E8E3F3]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'urgent'
                      ? 'bg-[#ca4669] text-white'
                      : notif.type === 'ai'
                      ? 'bg-[#c7ee55] text-[#536b00]'
                      : notif.type === 'warning'
                      ? 'bg-[#FFBF69] text-[#25203D]'
                      : 'bg-[#7657ff] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {notif.type === 'urgent'
                      ? 'crisis_alert'
                      : notif.type === 'ai'
                      ? 'auto_awesome'
                      : notif.type === 'warning'
                      ? 'warning'
                      : 'info'}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-bold text-xs text-[#1C1734]">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#797587]">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#484555] mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CLINICAL OPERATIONAL CONFIGURATION (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8E3F3] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F3]">
            <h3 className="font-sans font-extrabold text-base text-[#1C1734]">
              Operational Governance
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              Active Config
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#484555] mb-1">
                Clinic Facility Name
              </label>
              <input
                type="text"
                value={localSettings.clinicName}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, clinicName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#F7F1FF] border border-[#C9C4D8] rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-[#484555]">
                  Target SLA Max Wait (Minutes)
                </label>
                <span className="font-sans font-extrabold text-sm text-[#7657ff]">
                  {localSettings.slaMaxWaitMinutes}m
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={localSettings.slaMaxWaitMinutes}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    slaMaxWaitMinutes: Number(e.target.value),
                  })
                }
                className="w-full accent-[#7657ff]"
              />
              <span className="text-[10px] text-[#797587] block">
                Breaches beyond this threshold flag immediate Pop Coral alerts.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5FF] border border-[#E8E3F3] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-[#1C1734] block">
                    Require Admin Approval for AI
                  </span>
                  <span className="text-[11px] text-[#797587]">
                    Autonomous plans require CMO or lead physician sign-off
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.requireAdminApprovalForAI}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      requireAdminApprovalForAI: e.target.checked,
                    })
                  }
                  className="rounded text-[#7657ff] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#E8E3F3]">
                <div>
                  <span className="text-xs font-bold text-[#1C1734] block">
                    Automated SMS Parent/Patient Alerts
                  </span>
                  <span className="text-[11px] text-[#797587]">
                    Dispatches staggered check-in updates automatically
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.smsNotificationsEnabled}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      smsNotificationsEnabled: e.target.checked,
                    })
                  }
                  className="rounded text-[#7657ff] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#E8E3F3]">
                <div>
                  <span className="text-xs font-bold text-[#1C1734] block">
                    Broadcast Audio Chimes
                  </span>
                  <span className="text-[11px] text-[#797587]">
                    Play lounge chime when tokens are called
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundAlertsEnabled}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      soundAlertsEnabled: e.target.checked,
                    })
                  }
                  className="rounded text-[#7657ff] w-4 h-4"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#25203D] hover:bg-[#312C4A] text-white text-xs font-bold shadow-md transition-all active:scale-98"
              >
                Save Clinic Configuration
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modular Integrations Test & Diagnostic Console */}
      <IntegrationConsole />
    </div>
  );
};
