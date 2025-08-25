import { motion } from 'framer-motion';
import { useTimerStore, TimerPhase } from '@/store/timerStore';

interface DuckMascotProps {
  className?: string;
}

export function DuckMascot({ className = '' }: DuckMascotProps) {
  const { phase, isRunning, remainingTime, totalTime } = useTimerStore();

  const getMotivationalMessage = () => {
    if (phase === 'idle') return "Ready to focus? 🎯";
    if (phase === 'focus' && isRunning) return "You've got this! 💪";
    if (phase === 'focus' && !isRunning) return "Take your time...";
    if (phase === 'shortBreak') return "Quick break! ☕";
    if (phase === 'longBreak') return "Well deserved rest! 🌟";
    return "Let's go! 🚀";
  };

  // Calculate progress for subtle visual feedback
  const progress = totalTime > 0 ? ((totalTime - remainingTime) / totalTime) * 100 : 0;

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        className="relative mx-auto w-32 h-32 mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Progress ring */}
        <div className="absolute inset-0 rounded-full border-4 border-muted">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100, 100"
            />
            <motion.path
              className={`${
                phase === 'focus' 
                  ? 'text-duck-yellow' 
                  : phase === 'shortBreak' 
                  ? 'text-duck-blue' 
                  : 'text-duck-green'
              }`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${progress}, 100` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Duck emoji */}
        <div className="w-20 h-20 mx-auto mt-6 flex items-center justify-center text-5xl">
          🦆
        </div>
      </motion.div>

      {/* Motivational message */}
      <motion.p
        key={phase + isRunning}
        className="text-sm font-medium text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getMotivationalMessage()}
      </motion.p>
    </div>
  );
}