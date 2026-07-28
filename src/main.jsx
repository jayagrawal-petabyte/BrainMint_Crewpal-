import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StateProvider, useStore } from './store/StateContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/ToastContainer';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatCards } from './components/dashboard/StatCards';
import { TasksWidget } from './components/dashboard/TasksWidget';
import { ActivityFeed } from './components/dashboard/ActivityFeed';
import { UpcomingDeadlines } from './components/dashboard/UpcomingDeadlines';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { UserProfileModal } from './components/modals/UserProfileModal';

import './styles.css';
import './layout.css';

function DashboardApp() {
  const { auth, activeBranch } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <div className="main-wrapper">
        <Header
          setSidebarOpen={setSidebarOpen}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <main className="dashboard-content">
          {/* Welcome Header */}
          <div className="dashboard-intro">
            <div>
              <span className="date-stamp">{formattedDate}</span>
              <h1 className="dashboard-title">
                Welcome back, {auth.user ? auth.user.name : 'Harish'} 👋
              </h1>
              <p className="dashboard-subtitle">
                Overview of <strong>{activeBranch.name}</strong> • Harish’s Dashboard & State Management Module
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsTaskModalOpen(true)}
            >
              + Create Task
            </button>
          </div>

          {/* Key Metrics Section */}
          <StatCards />

          {/* Main Two-Column Layout */}
          <div className="dashboard-layout-grid">
            {/* Left Column: Assigned Tasks */}
            <div>
              <TasksWidget onOpenNewTaskModal={() => setIsTaskModalOpen(true)} />
            </div>

            {/* Right Column: Recent Activity & Upcoming Deadlines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ActivityFeed />
              <UpcomingDeadlines />
            </div>
          </div>
        </main>
      </div>

      {/* Global Modals & Toast Manager */}
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

// Render Root
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <StateProvider>
        <DashboardApp />
      </StateProvider>
    </ErrorBoundary>
  );
}
