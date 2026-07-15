import React, { useState } from 'react';
import { CelebrationProvider } from './context/CelebrationContext';
import { Navbar } from './components/Navbar';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { MonthByMonthView } from './components/MonthByMonthView';
import { UpdateDataModal } from './components/UpdateDataModal';
import { ViewMode } from './types/celebration';

export const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-primary text-main font-main">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      <main className="container flex-1 py-4 px-4 md:px-6">
        <SearchBarAndFilters />

        {currentView === 'dashboard' && (
          <DashboardView onViewChange={setCurrentView} />
        )}

        {currentView === 'calendar' && (
          <CalendarView />
        )}

        {currentView === 'months' && (
          <MonthByMonthView />
        )}
      </main>

      <UpdateDataModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <footer className="border-t border-border/80 py-6 mt-12 bg-secondary/40 text-center text-xs text-muted">
        <div className="container px-4">
          <p className="font-semibold text-main mb-1">
            🎉 Annes Celebrations Hub | Birthdays & Wedding Anniversaries
          </p>
          <p className="text-light">
            Locally hosted in <code className="px-1.5 py-0.5 rounded bg-tertiary text-purple-400 font-mono">d:\annes</code> • Fully ready for zero-config deployment to <strong>GitHub Pages</strong>
          </p>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <CelebrationProvider>
      <MainContent />
    </CelebrationProvider>
  );
}

export default App;
