import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PictureInPicture2 } from 'lucide-react';
import { useTimerStore } from '@/store/timerStore';
import { useTranslation } from 'react-i18next';

export function PIPButton() {
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if Picture-in-Picture is supported and we're in a top-level context
    const isSupported = 'documentPictureInPicture' in window;
    const isTopLevel = window.self === window.top;
    
    setIsPiPSupported(isSupported && isTopLevel);
    
    if (isSupported && !isTopLevel) {
      console.log('📺 PiP is supported but disabled in iframe context. Deploy the app to use Picture-in-Picture mode.');
    }
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
      const pipWindow = await (
        window as unknown as {
          documentPictureInPicture: {
            requestWindow: (options: { width: number; height: number }) => Promise<Window>;
          };
        }
      ).documentPictureInPicture.requestWindow({
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
        const phaseLabel =
          timer.phase === 'idle'
            ? t('pip.phaseReady')
            : timer.phase === 'focus'
            ? t('pip.phaseFocus')
            : timer.phase === 'shortBreak'
            ? t('pip.phaseShortBreak')
            : t('pip.phaseLongBreak');
        pipWindow.document.body.innerHTML = `
          <div class="timer">${formatTime(timer.remainingTime)}</div>
          <div class="phase">${phaseLabel}</div>
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

  // Don't show PiP button if not supported or in iframe
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
      aria-label={t('pip.open')}
    >
      <PictureInPicture2 className="w-4 h-4 mr-2" />
      {isPiPActive ? t('pip.active') : t('pip.mode')}
    </Button>
  );
}