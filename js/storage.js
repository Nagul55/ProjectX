// LocalStorage state management and default data presets

const STORAGE_KEY = 'FLOWCRAFT_PRODUCTIVITY_OS_DATA_V1';

const DEFAULT_DATA = {
  settings: {
    theme: 'dark-aurora', // 'dark-aurora', 'obsidian', 'cyber-neon', 'minimal-light'
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundVolume: 60,
    ambientType: 'none',
    ambientVolume: 50,
    dailyFocusGoalMinutes: 120,
    userName: 'Productivity Architect'
  },
  timer: {
    mode: 'focus', // 'focus', 'short-break', 'long-break'
    remainingSeconds: 25 * 60,
    isRunning: false,
    completedSessionsToday: 3,
    totalSessionsAllTime: 42,
    activeTaskId: 'task-1'
  },
  tasks: [
    {
      id: 'task-1',
      title: 'Design Q3 Product Roadmap & Feature Spec',
      description: 'Break down user stories, technical requirements, and dependency graph for upcoming sprint.',
      status: 'in-progress', // 'todo', 'in-progress', 'review', 'done'
      matrixQuadrant: 'do-first', // 'do-first' (Q1), 'schedule' (Q2), 'delegate' (Q3), 'eliminate' (Q4)
      priority: 'urgent', // 'urgent', 'high', 'medium', 'low'
      tags: ['Work', 'Strategy', 'DeepWork'],
      estimatedPomodoros: 4,
      completedPomodoros: 2,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      timeBlock: '09:00 - 11:00',
      subtasks: [
        { id: 'sub-1', title: 'Audit customer feature requests', completed: true },
        { id: 'sub-2', title: 'Draft technical architecture diagram', completed: true },
        { id: 'sub-3', title: 'Write milestone delivery estimates', completed: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Review System Architecture & Database Indexes',
      description: 'Optimize slow query endpoints and configure Redis cache layer.',
      status: 'todo',
      matrixQuadrant: 'schedule',
      priority: 'high',
      tags: ['Engineering', 'Performance'],
      estimatedPomodoros: 3,
      completedPomodoros: 0,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      timeBlock: '11:30 - 13:00',
      subtasks: [
        { id: 'sub-4', title: 'Run database query profiling', completed: false },
        { id: 'sub-5', title: 'Add missing composite indexes', completed: false }
      ]
    },
    {
      id: 'task-3',
      title: 'Team Sync & Project Status Update',
      description: 'Align design, product, and engineering on weekly deliverable checkpoints.',
      status: 'todo',
      matrixQuadrant: 'delegate',
      priority: 'medium',
      tags: ['Meetings', 'Team'],
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      timeBlock: '14:00 - 14:30',
      subtasks: []
    },
    {
      id: 'task-4',
      title: 'Daily Deep Work Reading & Skill Expansion',
      description: 'Read 20 pages of high-leverage systems thinking and software architecture literature.',
      status: 'done',
      matrixQuadrant: 'schedule',
      priority: 'medium',
      tags: ['Growth', 'Habits'],
      estimatedPomodoros: 2,
      completedPomodoros: 2,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      timeBlock: '08:00 - 08:50',
      subtasks: [
        { id: 'sub-6', title: 'Extract key mental models to digital notes', completed: true }
      ]
    },
    {
      id: 'task-5',
      title: 'Clean up Inbox & Unsubscribe Spam Newsletters',
      description: 'Declutter inbox zero and organize automated label filters.',
      status: 'todo',
      matrixQuadrant: 'eliminate',
      priority: 'low',
      tags: ['Admin'],
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      timeBlock: '17:00 - 17:30',
      subtasks: []
    }
  ],
  habits: [
    {
      id: 'habit-1',
      title: '90-Minute Morning Deep Work',
      category: 'Focus',
      icon: 'zap',
      targetDaysPerWeek: 6,
      streak: 14,
      bestStreak: 21,
      history: generateHabitHistory(14, 0.85)
    },
    {
      id: 'habit-2',
      title: 'Read 20 Pages of Tech / Philosophy',
      category: 'Learning',
      icon: 'book',
      targetDaysPerWeek: 7,
      streak: 9,
      bestStreak: 16,
      history: generateHabitHistory(9, 0.75)
    },
    {
      id: 'habit-3',
      title: '30-Minute Cardio & Strength Routine',
      category: 'Health',
      icon: 'activity',
      targetDaysPerWeek: 5,
      streak: 5,
      bestStreak: 12,
      history: generateHabitHistory(5, 0.7)
    },
    {
      id: 'habit-4',
      title: 'Evening Daily Review & Day Planning',
      category: 'Mindset',
      icon: 'moon',
      targetDaysPerWeek: 7,
      streak: 8,
      bestStreak: 18,
      history: generateHabitHistory(8, 0.9)
    }
  ],
  routines: [
    { id: 'rt-1', time: 'morning', title: 'Review priority tasks & plan time blocks', completed: true },
    { id: 'rt-2', time: 'morning', title: 'Glass of water & 5 min breathing/mindfulness', completed: true },
    { id: 'rt-3', time: 'morning', title: 'Eliminate phone notifications before 1st focus block', completed: true },
    { id: 'rt-4', time: 'evening', title: 'Check off completed tasks & log learnings', completed: false },
    { id: 'rt-5', time: 'evening', title: 'Clear browser tabs & prepare tomorrow top 3 goals', completed: false }
  ],
  focusLogs: generateInitialFocusLogs(),
  notes: `# Daily Master Scratchpad & Brain Dump

## 🎯 Today's Core Objective
- Deliver the **FlowCraft Productivity Suite** with pixel-perfect design and smooth soundscapes.

## 💡 Quick Ideas & Epiphanies
- **Time Boxing Rule**: Treat focus blocks as unshakeable calendar appointments with yourself.
- **2-Minute Rule**: If a quick task takes less than 120 seconds, execute immediately.
- **Energy Management**: Match high-cognitive load work (system architecture, creative coding) to morning biological prime hours.

## 📌 Meeting Notes / Scratch
- *Team alignment*: All deliverables on track for Friday milestone.
- *Ideas*: Add customizable procedural ambient soundscapes to keep flow state continuous.`
};

// Helper to generate simulated past 30-day habit history
function generateHabitHistory(currentStreak, completionRate) {
  const history = {};
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    
    if (i < currentStreak) {
      history[dateKey] = true;
    } else {
      history[dateKey] = Math.random() < completionRate;
    }
  }
  return history;
}

// Helper to generate past focus logs for analytics
function generateInitialFocusLogs() {
  const logs = [];
  const today = new Date();
  const tags = ['DeepWork', 'Engineering', 'Strategy', 'Growth', 'Admin'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = i === 0 ? 3 : Math.floor(Math.random() * 5) + 3;
    for (let j = 0; j < count; j++) {
      const duration = 25; // 25 mins
      const tag = tags[Math.floor(Math.random() * tags.length)];
      logs.push({
        id: 'log-' + Math.random().toString(36).substring(2, 9),
        date: dateStr,
        timestamp: new Date(date.getTime() + (9 + j * 1.5) * 3600000).toISOString(),
        durationMinutes: duration,
        tag: tag,
        taskTitle: 'Focus Session ' + (j + 1)
      });
    }
  }
  return logs;
}

class StorageManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          timer: { ...DEFAULT_DATA.timer, ...(parsed.timer || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to load stored data, fallback to defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.saveData();
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
  }

  exportDataJson() {
    return JSON.stringify(this.data, null, 2);
  }

  importDataJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.data = { ...DEFAULT_DATA, ...parsed };
        this.saveData();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveData();
  }
}

window.storageManager = new StorageManager();
