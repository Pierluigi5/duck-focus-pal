import { DuckMascot } from '@/components/DuckMascot';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsDrawer } from '@/components/StatsDrawer';
import { PIPButton } from '@/components/PIPButton';
import { useTimerStore } from '@/store/timerStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { settings } = useTimerStore();
  const { t } = useTranslation();

  // Apply theme and color theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply color theme
    document.documentElement.setAttribute('data-color-theme', settings.colorTheme);
  }, [settings.theme, settings.colorTheme]);

  // Set page title based on timer state
  const { remainingTime, phase, isRunning } = useTimerStore();
  useEffect(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (phase === 'idle') {
      document.title = '🦆 Duck Pomodoro';
    } else {
      const phaseEmoji = phase === 'focus' ? '🎯' : phase === 'shortBreak' ? '☕' : '🌟';
      const status = isRunning ? '' : '⏸️ ';
      document.title = `${status}${phaseEmoji} ${timeString} - Duck Pomodoro`;
    }
  }, [remainingTime, phase, isRunning]);

  return (
    <div className="min-h-screen bg-gradient-focus flex items-center justify-center p-4">
      {/* Fixed Corner Buttons */}
      <div className="fixed top-4 left-4 z-50">
        <PIPButton />
      </div>
      
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <StatsDrawer />
        <SettingsPanel />
      </div>

      {/* Main Centered Content */}
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-card/80 backdrop-blur-lg rounded-3xl p-8 shadow-duck border border-white/20"
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">🦆 Duck Pomodoro</h1>
            <p className="text-muted-foreground text-sm">
              {t('app.tagline')}
            </p>
          </motion.div>

          {/* Duck Mascot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <DuckMascot />
          </motion.div>

          {/* Timer Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <TimerDisplay />
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <TimerControls />
          </motion.div>

          {/* Keyboard Shortcuts Hint */}
          <motion.div
            className="text-center text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs mr-1">Space</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs mr-1">R</kbd>
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">→</kbd>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
