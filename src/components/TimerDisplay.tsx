import { useTimerStore } from '@/store/timerStore';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface TimerDisplayProps {
  className?: string;
}

export function TimerDisplay({ className = '' }: TimerDisplayProps) {
  const { t } = useTranslation();
  const { remainingTime, phase, currentCycle, completedPomodoros } = useTimerStore();
  
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  
  const getPhaseLabel = () => {
    switch (phase) {
      case 'focus':
        return t('timer.focus');
      case 'shortBreak':
        return t('timer.shortBreak');
      case 'longBreak':
        return t('timer.longBreak');
      default:
        return t('timer.ready');
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'focus':
        return 'text-duck-yellow';
      case 'shortBreak':
        return 'text-duck-blue';
      case 'longBreak':
        return 'text-duck-green';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Phase indicator */}
      <motion.div
        key={phase}
        className="space-y-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={`text-lg font-semibold ${getPhaseColor()}`}>
          {getPhaseLabel()}
        </h2>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <span>{t('timer.cycle')} {currentCycle}</span>
          <span>•</span>
          <span>{t('timer.completed', { count: completedPomodoros })}</span>
        </div>
      </motion.div>

      {/* Main timer */}
      <motion.div
        className="relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-6xl font-mono font-bold tracking-tight">
          <span
            className={`transition-colors duration-300 ${getPhaseColor()}`}
            aria-live="polite"
            aria-label={t('timer.remainingAria', { minutes, seconds })}
          >
            {formatTime(minutes)}:{formatTime(seconds)}
          </span>
        </div>
      </motion.div>

      {/* Progress indicator dots */}
      <div className="flex justify-center space-x-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < (currentCycle - 1) % 4
                ? 'bg-duck-yellow'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}