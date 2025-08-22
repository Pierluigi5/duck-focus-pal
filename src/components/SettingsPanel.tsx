import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, Volume2, VolumeX, Palette, Globe } from 'lucide-react';
import { useTimerStore, TimerSettings } from '@/store/timerStore';
import { motion } from 'framer-motion';

export function SettingsPanel() {
  const { settings, updateSettings } = useTimerStore();
  const [tempSettings, setTempSettings] = useState<TimerSettings>(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    updateSettings(tempSettings);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempSettings(settings);
  };

  const updateTempSetting = <K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 shadow-soft z-50"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Customize your Duck Pomodoro experience
          </SheetDescription>
        </SheetHeader>

        <motion.div
          className="space-y-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Timer Durations</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="focus-duration">Focus Duration (minutes)</Label>
                <Input
                  id="focus-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.focusDuration}
                  onChange={(e) => updateTempSetting('focusDuration', parseInt(e.target.value) || 25)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="short-break">Short Break (minutes)</Label>
                <Input
                  id="short-break"
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreakDuration}
                  onChange={(e) => updateTempSetting('shortBreakDuration', parseInt(e.target.value) || 5)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="long-break">Long Break (minutes)</Label>
                <Input
                  id="long-break"
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreakDuration}
                  onChange={(e) => updateTempSetting('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="long-break-interval">Long Break After (pomodoros)</Label>
                <Input
                  id="long-break-interval"
                  type="number"
                  min="2"
                  max="10"
                  value={tempSettings.longBreakInterval}
                  onChange={(e) => updateTempSetting('longBreakInterval', parseInt(e.target.value) || 4)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              {tempSettings.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              Audio
            </h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled" className="text-sm">
                Play notification sounds
              </Label>
              <Switch
                id="sound-enabled"
                checked={tempSettings.soundEnabled}
                onCheckedChange={(checked) => updateTempSetting('soundEnabled', checked)}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </h3>
            
            <div>
              <Label htmlFor="color-theme">Color Theme</Label>
              <Select
                value={tempSettings.colorTheme}
                onValueChange={(value: 'classic' | 'sunset' | 'ocean' | 'forest' | 'lavender' | 'candy') => 
                  updateTempSetting('colorTheme', value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">🦆 Classic Duck</SelectItem>
                  <SelectItem value="sunset">🌅 Sunset</SelectItem>
                  <SelectItem value="ocean">🌊 Ocean</SelectItem>
                  <SelectItem value="forest">🌲 Forest</SelectItem>
                  <SelectItem value="lavender">💜 Lavender</SelectItem>
                  <SelectItem value="candy">🍭 Candy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="animation-level">Animation Level</Label>
              <Select
                value={tempSettings.animationLevel}
                onValueChange={(value: 'minimal' | 'normal' | 'full') => 
                  updateTempSetting('animationLevel', value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={tempSettings.theme}
                onValueChange={(value: 'light' | 'dark') => updateTempSetting('theme', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </h3>
            
            <Select
              value={tempSettings.language}
              onValueChange={(value: 'en' | 'it') => updateTempSetting('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </motion.div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div><kbd className="bg-background px-1 rounded">Space</kbd> - Start/Pause</div>
            <div><kbd className="bg-background px-1 rounded">R</kbd> - Reset</div>
            <div><kbd className="bg-background px-1 rounded">→</kbd> - Skip Phase</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}