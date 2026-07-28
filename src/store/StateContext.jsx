import React, { createContext, useContext, useState, useEffect } from 'react';

// Create State Context
const StateContext = createContext();

const AUTH_STORAGE_KEY = 'school_erp_auth_harish';
const THEME_STORAGE_KEY = 'school_erp_theme_harish';

// Initial Seed Data for School ERP System
const initialBranches = [
  { id: 'sch_delhi_main', name: 'Delhi Main Campus', code: 'DEL-MAIN', city: 'New Delhi' },
  { id: 'sch_delhi_north', name: 'North Delhi Branch', code: 'DEL-NTH', city: 'North Delhi' },
  { id: 'sch_mumbai', name: 'Mumbai West Branch', code: 'MUM-WEST', city: 'Mumbai' },
  { id: 'sch_bengaluru', name: 'Bengaluru Tech Campus', code: 'BLR-TECH', city: 'Bengaluru' },
];

const initialTasks = [
  {
    id: 'tsk_101',
    title: 'Audit Class 10th CBSE Marks Submission',
    project: 'Academic Administration',
    priority: 'High',
    dueDate: 'Today',
    status: 'pending',
    assignedTo: 'Harish R.',
    assignedRole: 'admin',
    assigneeInitials: 'HR'
  },
  {
    id: 'tsk_102',
    title: 'Configure OAuth2 Authentication flow for Teachers',
    project: 'Core Platform',
    priority: 'High',
    dueDate: 'Tomorrow',
    status: 'in-progress',
    assignedTo: 'Harish R.',
    assignedRole: 'admin',
    assigneeInitials: 'HR'
  },
  {
    id: 'tsk_103',
    title: 'Review Student Onboarding Documentation',
    project: 'Mobile App',
    priority: 'Medium',
    dueDate: 'Aug 02',
    status: 'completed',
    assignedTo: 'Nikhil K.',
    assignedRole: 'teacher',
    assigneeInitials: 'NK'
  },
  {
    id: 'tsk_104',
    title: 'Publish Sprint 4 Retrospective & ERP Metrics',
    project: 'Core Platform',
    priority: 'Low',
    dueDate: 'Aug 05',
    status: 'pending',
    assignedTo: 'Anuj M.',
    assignedRole: 'staff',
    assigneeInitials: 'AM'
  },
  {
    id: 'tsk_105',
    title: 'Approve Q3 Fee Concession Applications',
    project: 'Fee Management',
    priority: 'High',
    dueDate: 'Aug 08',
    status: 'pending',
    assignedTo: 'Harish R.',
    assignedRole: 'admin',
    assigneeInitials: 'HR'
  }
];

const initialActivities = [
  {
    id: 'act_1',
    user: 'Anuj Sharma',
    userInitials: 'AS',
    role: 'Teacher',
    action: 'uploaded mid-term exam marks for',
    target: 'Class 10-A Mathematics',
    timestamp: '8 min ago',
    category: 'Academics'
  },
  {
    id: 'act_2',
    user: 'Nikhil Verma',
    userInitials: 'NV',
    role: 'Admin',
    action: 'approved staff leave request for',
    target: 'Mrs. Priya Gupta',
    timestamp: '24 min ago',
    category: 'Administrative'
  },
  {
    id: 'act_3',
    user: 'Harish R.',
    userInitials: 'HR',
    role: 'Product Manager',
    action: 'updated active branch context to',
    target: 'Delhi Main Campus',
    timestamp: '1 hr ago',
    category: 'System'
  },
  {
    id: 'act_4',
    user: 'Aziz Khan',
    userInitials: 'AK',
    role: 'Finance Officer',
    action: 'generated fee receipts for',
    target: '245 Students in Grade 12',
    timestamp: '2 hrs ago',
    category: 'Finance'
  }
];

const initialDeadlines = [
  { day: '30', month: 'JUL', title: 'Finalize Q3 Academic ERP Proposal', department: 'Core Platform', urgency: 'High' },
  { day: '02', month: 'AUG', title: 'Release Notes for Parent Portal App', department: 'Mobile App', urgency: 'Medium' },
  { day: '05', month: 'AUG', title: 'Teacher-Parent Conference Schedule', department: 'Academics', urgency: 'Low' }
];

export function StateProvider({ children }) {
  // --- 1. Theme State ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- 2. Auth State (Role-based, Persisted) ---
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved auth', e);
    }
    return {
      user: {
        id: 'usr_harish_01',
        name: 'Harish R.',
        email: 'harish.r@schoolerp.edu',
        role: 'admin', // Role: 'admin' | 'teacher' | 'student' | 'staff'
        avatar: 'HR',
        department: 'Product & State Architecture'
      },
      token: 'jwt_mock_token_harish_98765',
      isAuthenticated: true
    };
  });

  const login = (email, role = 'admin') => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      role: role,
      avatar: email.substring(0, 2).toUpperCase(),
      department: role === 'admin' ? 'School Administration' : 'Academic Faculty'
    };
    const newAuth = { user: newUser, token: `jwt_token_${Date.now()}`, isAuthenticated: true };
    setAuth(newAuth);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuth));
    addToast(`Logged in successfully as ${newUser.name} (${role.toUpperCase()})`, 'success');
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    addToast('Logged out of School ERP system', 'info');
  };

  // --- 3. User State ---
  const [userProfile, setUserProfile] = useState({
    phone: '+91 98765 43210',
    address: 'Block 4, Central Campus Residency, New Delhi',
    joinedDate: '2022-06-15',
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      taskReminders: true
    }
  });

  const updateProfile = (updatedFields) => {
    setUserProfile(prev => ({ ...prev, ...updatedFields }));
    addToast('User profile updated successfully', 'success');
  };

  // --- 4. Project / School Context State ---
  const [branches] = useState(initialBranches);
  const [activeSchoolId, setActiveSchoolId] = useState('sch_delhi_main');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');

  const activeBranch = branches.find(b => b.id === activeSchoolId) || branches[0];

  const changeBranch = (branchId) => {
    const selected = branches.find(b => b.id === branchId);
    if (selected) {
      setActiveSchoolId(selected.id);
      addToast(`Switched active branch to ${selected.name}`, 'info');
    }
  };

  // --- 5. Tasks State (CRUD) ---
  const [tasks, setTasks] = useState(initialTasks);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'pending' | 'in-progress' | 'completed'

  const toggleTaskStatus = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : t.status === 'pending' ? 'in-progress' : 'completed';
          addToast(`Task marked as ${nextStatus.toUpperCase()}`, 'success');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const addTask = (newTaskData) => {
    const created = {
      id: `tsk_${Date.now()}`,
      title: newTaskData.title,
      project: newTaskData.project || 'General Administration',
      priority: newTaskData.priority || 'Medium',
      dueDate: newTaskData.dueDate || 'Today',
      status: 'pending',
      assignedTo: auth.user ? auth.user.name : 'Harish R.',
      assignedRole: auth.user ? auth.user.role : 'admin',
      assigneeInitials: auth.user ? auth.user.avatar : 'HR'
    };
    setTasks(prev => [created, ...prev]);
    addToast(`New task "${created.title}" created`, 'success');
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addToast('Task deleted from workspace', 'info');
  };

  // --- 6. Statistics & Metrics State ---
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalStudents: 1420,
    totalTeachers: 86,
    pendingTasksCount: tasks.filter(t => t.status !== 'completed').length,
    attendancePercent: 94.8,
    feesCollectedPercent: 88.5
  });

  // Keep pending tasks count updated when tasks change
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      pendingTasksCount: tasks.filter(t => t.status !== 'completed').length
    }));
  }, [tasks]);

  const refreshMetrics = () => {
    setMetricsLoading(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        totalStudents: prev.totalStudents + Math.floor(Math.random() * 5),
        attendancePercent: +(94 + Math.random() * 2).toFixed(1)
      }));
      setMetricsLoading(false);
      addToast('Dashboard metrics refreshed from backend API', 'success');
    }, 600);
  };

  // --- 7. Activity Feed State ---
  const [activities, setActivities] = useState(initialActivities);

  const addActivity = (action, target, category = 'System') => {
    const newAct = {
      id: `act_${Date.now()}`,
      user: auth.user ? auth.user.name : 'System User',
      userInitials: auth.user ? auth.user.avatar : 'SU',
      role: auth.user ? auth.user.role : 'Admin',
      action: action,
      target: target,
      timestamp: 'Just now',
      category: category
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // --- 8. Global Loading States Map ---
  const [loadingMap, setLoadingMap] = useState({
    global: false,
    auth: false,
    tasks: false,
    metrics: false
  });

  const setSliceLoading = (slice, isLoading) => {
    setLoadingMap(prev => ({ ...prev, [slice]: isLoading }));
  };

  // --- 9. Global Error Handling & Toast Notifications ---
  const [toasts, setToasts] = useState([]);
  const [globalError, setGlobalError] = useState(null);

  const addToast = (message, type = 'info') => {
    const toastId = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      removeToast(toastId);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const reportError = (errorMsg) => {
    console.error('[Global Error Caught]:', errorMsg);
    setGlobalError(errorMsg);
    addToast(errorMsg, 'error');
  };

  const clearGlobalError = () => {
    setGlobalError(null);
  };

  const value = {
    // Theme
    theme,
    toggleTheme,
    // Auth & Permissions
    auth,
    login,
    logout,
    // User Profile
    userProfile,
    updateProfile,
    // Project/Branch
    branches,
    activeSchoolId,
    activeBranch,
    academicYear,
    changeBranch,
    setAcademicYear,
    // Tasks
    tasks,
    taskFilter,
    setTaskFilter,
    toggleTaskStatus,
    addTask,
    deleteTask,
    // Metrics
    metrics,
    metricsLoading,
    refreshMetrics,
    // Activity & Deadlines
    activities,
    deadlines: initialDeadlines,
    addActivity,
    // Loading Map
    loadingMap,
    setSliceLoading,
    // Global Error & Toasts
    toasts,
    addToast,
    removeToast,
    globalError,
    reportError,
    clearGlobalError
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStore must be used within a StateProvider');
  }
  return context;
};
