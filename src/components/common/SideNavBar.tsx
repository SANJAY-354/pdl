import React from 'react';
import { useClinic, RouteType } from '../../context/ClinicContext';

interface NavItem {
  id: RouteType;
  label: string;
  icon: string;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { id: 'operations', label: 'Operations', icon: 'dashboard' },
  { id: 'live-queue', label: 'Live Queue', icon: 'queue' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar_today' },
  { id: 'specialties', label: 'Specialties', icon: 'medical_services' },
  { id: 'ai-insights', label: 'AI Insights', icon: 'auto_awesome' },
  { id: 'staff-schedule', label: 'Staff Schedule', icon: 'badge' },
  { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
];

export const SideNavBar: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentRoute, setCurrentRoute, queue, recommendations, setSelectedRecommendation, setIsAIApprovalModalOpen } = useClinic();

  const handleNavClick = (route: RouteType) => {
    setCurrentRoute(route);
    onCloseMobile();
  };

  const handleQuickOptimize = () => {
    const pending = recommendations.find(r => r.status === 'Pending Approval') || recommendations[0];
    setSelectedRecommendation(pending);
    setIsAIApprovalModalOpen(true);
  };

  const waitingCount = queue.filter(q => q.status === 'Waiting').length;
  const pendingAiCount = recommendations.filter(r => r.status === 'Pending Approval').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 flex flex-col justify-between bg-[#25203D] border-r border-[#c9c4d8]/20 shadow-2xl z-50 py-6 px-4 transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding & Clinic Identity */}
        <div>
          <div className="flex items-center justify-between px-2 mb-7">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7657ff] flex items-center justify-center text-white shadow-md relative">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#c7ee55] rounded-full border-2 border-[#25203D] animate-ping" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#c7ee55] rounded-full border-2 border-[#25203D]" />
              </div>
              <div>
                <h1 className="font-sans text-[18px] font-extrabold text-white tracking-tight leading-tight">
                  MediFlow AI
                </h1>
                <p className="text-[10px] uppercase font-bold text-[#c9c4d8] tracking-widest">
                  Regional Health Hub
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#c9c4d8] hover:text-white md:hidden"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Quick AI Trigger CTA */}
          <button
            onClick={handleQuickOptimize}
            className="w-full mb-6 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#c7ee55] text-[#536b00] font-sans text-xs font-bold hover:brightness-105 active:scale-98 transition-all shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
                auto_awesome
              </span>
              <span>Optimize Queue</span>
            </span>
            <div className="flex items-center gap-1.5">
              {pendingAiCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-[#536b00] text-[#c7ee55] text-[10px] font-extrabold">
                  {pendingAiCount}
                </span>
              )}
              <span className="w-2 h-2 rounded-full bg-[#536b00] animate-pulse" />
            </div>
          </button>

          {/* Main Destination Navigation Tabs */}
          <nav aria-label="Main Navigation" className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              let badgeVal: string | number | undefined = undefined;
              if (item.id === 'live-queue' && waitingCount > 0) badgeVal = waitingCount;
              if (item.id === 'ai-insights' && pendingAiCount > 0) badgeVal = `${pendingAiCount} New`;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[14px] transition-all ${
                    isActive
                      ? 'bg-[#5d39e5] text-white shadow-sm font-semibold'
                      : 'text-[#c9c4d8] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {badgeVal && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.id === 'ai-insights'
                          ? 'bg-[#c7ee55] text-[#536b00]'
                          : 'bg-[#FF6F91] text-white'
                      }`}
                    >
                      {badgeVal}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Nav Utility & Profile */}
        <div className="pt-4 border-t border-[#c9c4d8]/15 space-y-4">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg font-medium text-[14px] transition-colors ${
                currentRoute === 'settings'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-[#c9c4d8] hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </button>
            <a
              href="https://github.com/SANJAY-354/pdl"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-[#c9c4d8] hover:text-white hover:bg-white/10 font-medium text-[14px] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">contact_support</span>
              <span>Repo & Support</span>
            </a>
          </div>

          {/* Chief Medical Officer Profile Card */}
          <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-[#c9c4d8]/15">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#7657ff] shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Portrait of Dr. Sarah Lin"
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] text-white font-bold truncate leading-tight">
                Dr. Sarah Lin
              </p>
              <p className="text-[11px] text-[#c9c4d8] truncate">
                Chief Medical Officer
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
