import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, RotateCcw, X } from 'lucide-react';
import { ModeSelector, GameMode } from '@/components/ModeSelector';

interface SettingsMenuProps {
  onReset: () => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  disabled?: boolean;
}

export const SettingsMenu = ({ onReset, mode, setMode, disabled }: SettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Settings Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="bg-card border-primary text-primary hover:bg-primary/10"
        title="ตั้งค่า"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-bounce-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                ตั้งค่า
              </h2>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Mode Selector moved into Settings */}
              <ModeSelector mode={mode} setMode={(m) => { setMode(m); }} disabled={disabled} />

              {/* Reset Button */}
              <Button
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตทั้งหมด? ข้อมูลจะถูกลบออกทั้งหมด')) {
                    onReset();
                    setIsOpen(false);
                  }
                }}
                variant="outline"
                className="w-full justify-start text-lg py-6 border-destructive text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                รีเซ็ตข้อมูลทั้งหมด
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              การรีเซ็ตจะลบรายชื่อทั้งหมดและเริ่มเกมใหม่
            </p>
          </div>
        </div>
      )}
    </>
  );
};
