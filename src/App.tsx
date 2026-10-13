import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { SideNavBar } from './components/common/SideNavBar';
import { TopNavBar } from './components/common/TopNavBar';
import { ToastNotification } from './components/modals/ToastNotification';
import { EmergencyTriageModal } from './components/modals/EmergencyTriageModal';
import { AIApprovalModal } from './components/modals/AIApprovalModal';
import { BookingDrawer } from './components/modals/BookingDrawer';
import { AudioAnnouncementModal } from './components/modals/AudioAnnouncementModal';

// Screens
import { OperationsDashboard } from './components/screens/OperationsDashboard';
import { LiveQueueHub } from './components/screens/LiveQueueHub';
import { AppointmentBooking } from './components/screens/AppointmentBooking';
import { SpecialtyManagement } from './components/screens/SpecialtyManagement';
import { StaffSchedule } from './components/screens/StaffSchedule';
import { AIInsights } from './components/screens/AIInsights';
import { AnalyticsIntelligence } from './components/screens/AnalyticsIntelligence';
import { ClinicSettings } from './components/screens/ClinicSettings';

const AppContent: React.FC = () => {
  const { currentRoute, setCurrentRoute, queue } = useClinic();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const waitingCount = queue.filter((q) => q.status === 'Waiting').length;

  const renderActiveScreen = () => {
    switch (currentRoute) {
      case 'operations':
        return <OperationsDashboard />;
      case 'live-queue':
        return <LiveQueueHub />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'specialties':
        return <SpecialtyManagement />;
      case 'staff-schedule':
        return <StaffSchedule />;
      case 'ai-insights':
        return <AIInsights />;
      case 'analytics':
        return <AnalyticsIntelligence />;
      case 'settings':
        return <ClinicSettings />;
      default:
        return <OperationsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF] text-[#1C1734] font-sans flex flex-col md:flex-row antialiased selection:bg-[#7657ff] selection:text-white pb-16 md:pb-0">
      {/* SIDEBAR NAVIGATION */}
      <SideNavBar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen">
        {/* TOP APP BAR */}
        <TopNavBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* WORKSPACE CANVAS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1720px] w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#25203D] text-white border-t border-[#c9c4d8]/20 flex items-center justify-around py-2 px-1 md:hidden shadow-lg">
        <button
          onClick={() => setCurrentRoute('operations')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold ${
            currentRoute === 'operations' ? 'text-[#c7ee55]' : 'text-[#c9c4d8]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span>Ops</span>
        </button>

        <button
          onClick={() => setCurrentRoute('live-queue')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold relative ${
            currentRoute === 'live-queue' ? 'text-[#c7ee55]' : 'text-[#c9c4d8]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">queue</span>
          <span>Queue</span>
          {waitingCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#FF6F91]" />
          )}
        </button>

        <button
          onClick={() => setCurrentRoute('appointments')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold ${
            currentRoute === 'appointments' ? 'text-[#c7ee55]' : 'text-[#c9c4d8]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">calendar_today</span>
          <span>Book</span>
        </button>

        <button
          onClick={() => setCurrentRoute('specialties')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold ${
            currentRoute === 'specialties' ? 'text-[#c7ee55]' : 'text-[#c9c4d8]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">medical_services</span>
          <span>Wings</span>
        </button>

        <button
          onClick={() => setCurrentRoute('ai-insights')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold ${
            currentRoute === 'ai-insights' ? 'text-[#c7ee55]' : 'text-[#c9c4d8]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
          <span>AI</span>
        </button>
      </nav>

      {/* OVERLAY MODALS & DRAWERS */}
      <BookingDrawer />
      <EmergencyTriageModal />
      <AIApprovalModal />
      <AudioAnnouncementModal />
      <ToastNotification />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
};

export default App;
