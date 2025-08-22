import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PictureInPicture2 } from 'lucide-react';
import { useTimerStore } from '@/store/timerStore';

export function PIPButton() {
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const { remainingTime, phase } = useTimerStore();

  useEffect(() => {
    // Check if Picture-in-Picture is supported
    setIsPiPSupported('documentPictureInPicture' in window);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const openPiP = async () => {
    if (!isPiPSupported || isPiPActive) return;

    try {
      // Create PiP window with minimal timer
      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 200,
        height: 120,
      });

      // Style the PiP window
      pipWindow.document.head.innerHTML = `
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: system-ui, sans-serif; 
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100vh;
            box-sizing: border-box;
          }
          .timer { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 8px;
            color: #92400e;
          }
          .phase { 
            font-size: 12px; 
            color: #a16207;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        </style>
      `;

      const updatePiP = () => {
        const timer = useTimerStore.getState();
        pipWindow.document.body.innerHTML = `
          <div class="timer">${formatTime(timer.remainingTime)}</div>
          <div class="phase">${timer.phase === 'idle' ? 'Ready' : 
            timer.phase === 'focus' ? 'Focus' : 
            timer.phase === 'shortBreak' ? 'Short Break' : 'Long Break'}</div>
        `;
      };

      // Initial update
      updatePiP();

      // Update every second
      const interval = setInterval(updatePiP, 1000);

      setIsPiPActive(true);

      // Clean up when PiP is closed
      pipWindow.addEventListener('pagehide', () => {
        clearInterval(interval);
        setIsPiPActive(false);
      });

    } catch (error) {
      console.error('Failed to open Picture-in-Picture:', error);
    }
  };

  if (!isPiPSupported) {
    return null;
  }

  return (
    <Button
      onClick={openPiP}
      variant="outline"
      size="sm"
      disabled={isPiPActive}
      className="fixed top-4 left-4 shadow-soft z-50"
      aria-label="Open Picture-in-Picture timer"
    >
      <PictureInPicture2 className="w-4 h-4 mr-2" />
      {isPiPActive ? 'PiP Active' : 'PiP Mode'}
    </Button>
  );
}