import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak' | 'idle';

export type ColorTheme = 'classic' | 'sunset' | 'ocean' | 'forest' | 'lavender' | 'candy';

export interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // after how many focus sessions
  soundEnabled: boolean;
  animationLevel: 'minimal' | 'normal' | 'full';
  theme: 'light' | 'dark';
  colorTheme: ColorTheme;
  language: 'en' | 'it';
}

export interface SessionHistory {
  id: string;
  date: string;
  type: 'focus' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  completed: boolean;
}

export interface TimerStats {
  todayPomodoros: number;
  totalPomodoros: number;
  streakDays: number;
  lastActiveDate: string;
  history: SessionHistory[];
}

interface TimerState {
  // Core timer state
  phase: TimerPhase;
  isRunning: boolean;
  remainingTime: number; // in seconds
  totalTime: number; // in seconds
  currentCycle: number;
  completedPomodoros: number;
  
  // Settings
  settings: TimerSettings;
  
  // Stats
  stats: TimerStats;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipPhase: () => void;
  tick: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  setPhase: (phase: TimerPhase) => void;
  clearHistory: () => void;
}

const defaultSettings: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: false,
  animationLevel: 'normal',
  theme: 'light',
  colorTheme: 'classic',
  language: 'en',
};

const defaultStats: TimerStats = {
  todayPomodoros: 0,
  totalPomodoros: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  history: [],
};

const getPhaseTime = (phase: TimerPhase, settings: TimerSettings): number => {
  switch (phase) {
    case 'focus':
      return settings.focusDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
    default:
      return 0;
  }
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      isRunning: false,
      remainingTime: defaultSettings.focusDuration * 60,
      totalTime: defaultSettings.focusDuration * 60,
      currentCycle: 0,
      completedPomodoros: 0,
      settings: defaultSettings,
      stats: defaultStats,

      startTimer: () => {
        const state = get();
        if (state.phase === 'idle') {
          // Start first pomodoro
          const time = getPhaseTime('focus', state.settings);
          set({
            phase: 'focus',
            isRunning: true,
            remainingTime: time,
            totalTime: time,
            currentCycle: 1,
          });
        } else {
          set({ isRunning: true });
        }
      },

      pauseTimer: () => set({ isRunning: false }),

      resetTimer: () => {
        const state = get();
        const time = getPhaseTime('focus', state.settings);
        set({
          phase: 'idle',
          isRunning: false,
          remainingTime: time,
          totalTime: time,
          currentCycle: 0,
        });
      },

      skipPhase: () => {
        const state = get();
        if (!state.isRunning && state.phase === 'idle') return;
        
        let nextPhase: TimerPhase = 'focus';
        let nextCycle = state.currentCycle;
        let newCompletedPomodoros = state.completedPomodoros;

        if (state.phase === 'focus') {
          newCompletedPomodoros++;
          const isLongBreak = state.currentCycle % state.settings.longBreakInterval === 0;
          nextPhase = isLongBreak ? 'longBreak' : 'shortBreak';
        } else {
          // From break to focus
          nextPhase = 'focus';
          nextCycle = state.currentCycle + 1;
        }

        const time = getPhaseTime(nextPhase, state.settings);
        set({
          phase: nextPhase,
          remainingTime: time,
          totalTime: time,
          currentCycle: nextCycle,
          completedPomodoros: newCompletedPomodoros,
          isRunning: false,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning || state.remainingTime <= 0) return;

        const newTime = state.remainingTime - 1;
        
        if (newTime <= 0) {
          // Phase completed
          let nextPhase: TimerPhase = 'focus';
          let nextCycle = state.currentCycle;
          let newCompletedPomodoros = state.completedPomodoros;
          let newStats = { ...state.stats };

          if (state.phase === 'focus') {
            newCompletedPomodoros++;
            // Update stats
            const today = new Date().toISOString().split('T')[0];
            const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Add completed session to history
            const newSession: SessionHistory = {
              id: sessionId,
              date: new Date().toISOString(),
              type: 'focus',
              duration: state.settings.focusDuration,
              completed: true,
            };
            
            if (newStats.lastActiveDate !== today) {
              newStats = {
                ...newStats,
                todayPomodoros: 1,
                lastActiveDate: today,
                streakDays: newStats.streakDays + 1,
                history: [...newStats.history, newSession],
              };
            } else {
              newStats = {
                ...newStats,
                todayPomodoros: newStats.todayPomodoros + 1,
                history: [...newStats.history, newSession],
              };
            }
            newStats.totalPomodoros++;

            const isLongBreak = state.currentCycle % state.settings.longBreakInterval === 0;
            nextPhase = isLongBreak ? 'longBreak' : 'shortBreak';
          } else {
            // From break to focus
            nextPhase = 'focus';
            nextCycle = state.currentCycle + 1;
          }

          const time = getPhaseTime(nextPhase, state.settings);
          
          // Play notification sound if enabled
          if (state.settings.soundEnabled) {
            // We'll implement sound later
            console.log('🦆 Quack! Phase completed!');
          }

          set({
            phase: nextPhase,
            remainingTime: time,
            totalTime: time,
            currentCycle: nextCycle,
            completedPomodoros: newCompletedPomodoros,
            stats: newStats,
            isRunning: false, // Auto-pause on phase completion
          });
        } else {
          set({ remainingTime: newTime });
        }
      },

      updateSettings: (newSettings: Partial<TimerSettings>) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };
        
        // Apply color theme to document
        if (newSettings.colorTheme) {
          document.documentElement.setAttribute('data-color-theme', newSettings.colorTheme);
        }
        
        // If timer is idle, update the remaining time to match new focus duration
        let updates: Partial<TimerState> = { settings: updatedSettings };
        
        if (state.phase === 'idle') {
          const time = getPhaseTime('focus', updatedSettings);
          updates = {
            ...updates,
            remainingTime: time,
            totalTime: time,
          };
        }
        
        set(updates);
      },

      setPhase: (phase: TimerPhase) => {
        const state = get();
        const time = getPhaseTime(phase, state.settings);
        set({
          phase,
          remainingTime: time,
          totalTime: time,
          isRunning: false,
        });
      },

      clearHistory: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            history: [],
            todayPomodoros: 0,
            totalPomodoros: 0,
            streakDays: 0,
          },
        }));
      },
    }),
    {
      name: 'duck-pomodoro-storage',
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
        completedPomodoros: state.completedPomodoros,
        currentCycle: state.currentCycle,
      }),
    }
  )
);