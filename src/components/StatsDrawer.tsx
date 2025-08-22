import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BarChart3 } from 'lucide-react';
import { StatsPanel } from '@/components/StatsPanel';

export function StatsDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shadow-soft"
          aria-label="View statistics"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistics
          </SheetTitle>
          <SheetDescription>
            Track your focus progress and achievements
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <StatsPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}