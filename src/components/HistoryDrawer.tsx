import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Trash2 } from 'lucide-react';
import { useTimerStore } from '@/store/timerStore';
import { motion } from 'framer-motion';

export function HistoryDrawer() {
  const { stats, clearHistory } = useTimerStore();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Today ${date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleString('it-IT', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmoji = (type: string) => {
    switch (type) {
      case 'focus': return '🎯';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🌟';
      default: return '⏱️';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shadow-soft"
          aria-label="View history"
        >
          <Clock className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            History
          </SheetTitle>
          <SheetDescription>
            Your pomodoro sessions history
          </SheetDescription>
        </SheetHeader>

        <motion.div
          className="space-y-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.todayPomodoros}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalPomodoros}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Sessions</h3>
              {stats.history.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear History?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your session history and reset your stats. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={clearHistory}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Clear History
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {stats.history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No sessions yet</p>
                <p className="text-xs">Start your first pomodoro!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stats.history
                  .slice()
                  .reverse()
                  .map((session) => (
                    <motion.div
                      key={session.id}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-lg">{getEmoji(session.type)}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {session.type === 'focus' ? 'Focus' : 
                           session.type === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(session.date)} • {session.duration}min
                        </div>
                      </div>
                      {session.completed && (
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">
                          ✓
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}