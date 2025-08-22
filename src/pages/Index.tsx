import { DuckMascot } from '@/components/DuckMascot';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsPanel } from '@/components/StatsPanel';
import { PIPButton } from '@/components/PIPButton';
import { useTimerStore } from '@/store/timerStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Index = () => {
  const { settings } = useTimerStore();

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

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
    <div className="min-h-screen bg-gradient-focus">
      {/* Fixed UI Elements */}
      <PIPButton />
      <SettingsPanel />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              🦆 Duck Pomodoro
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Focus with your friendly duck companion
            </motion.p>
          </div>

          {/* Main Timer Section */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column: Duck & Timer */}
            <motion.div
              className="space-y-6 order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DuckMascot />
              <TimerControls />
            </motion.div>

            {/* Right Column: Display & Stats */}
            <motion.div
              className="space-y-6 order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-soft border">
                <TimerDisplay />
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-soft border">
                <StatsPanel />
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="text-center text-xs text-muted-foreground space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>Press <kbd className="bg-muted px-1 py-0.5 rounded text-xs">Space</kbd> to start/pause, <kbd className="bg-muted px-1 py-0.5 rounded text-xs">R</kbd> to reset, <kbd className="bg-muted px-1 py-0.5 rounded text-xs">→</kbd> to skip</p>
            <p>Made with 💛 for productive focus sessions</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
