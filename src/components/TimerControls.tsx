import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/store/timerStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useEffect } from 'react';

interface TimerControlsProps {
  className?: string;
}

export function TimerControls({ className = '' }: TimerControlsProps) {
  const { 
    isRunning, 
    phase, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipPhase,
    tick 
  } = useTimerStore();

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (isRunning) {
            pauseTimer();
          } else {
            startTimer();
          }
          break;
        case 'KeyR':
          event.preventDefault();
          resetTimer();
          break;
        case 'ArrowRight':
          event.preventDefault();
          skipPhase();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, startTimer, pauseTimer, resetTimer, skipPhase]);

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {/* Primary play/pause button */}
      <Button
        onClick={handleStartPause}
        size="lg"
        className="min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start
          </>
        )}
      </Button>

      {/* Reset button */}
      <Button
        onClick={resetTimer}
        variant="outline"
        size="lg"
        className="min-w-[100px]"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>

      {/* Skip button - only show when not idle */}
      {phase !== 'idle' && (
        <Button
          onClick={skipPhase}
          variant="outline"
          size="lg"
          className="min-w-[100px]"
          aria-label="Skip to next phase"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip
        </Button>
      )}
    </div>
  );
}