import { Button } from '@/components/ui/button';
import { Gift, Briefcase } from 'lucide-react';

export type GameMode = 'employee' | 'executive';

interface ModeSelectorProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  disabled?: boolean;
}

export const ModeSelector = ({ mode, setMode, disabled }: ModeSelectorProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 mb-2">
      <span className="mb-2 text-base font-bold text-primary">เลือกโหมดการสุ่ม</span>
      <div className="flex gap-3">
        <Button
          variant={mode === 'employee' ? 'default' : 'outline'}
          size="lg"
          onClick={() => setMode('employee')}
          disabled={disabled}
          className={`transition-all duration-300 rounded-xl border-2 shadow-lg text-lg px-6 py-3 font-bold ${
            mode === 'employee' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white/40 backdrop-blur-sm border-primary/40 text-primary hover:bg-white/60'
          }`}
        >
          <Gift className="w-6 h-6 mr-2" />
          Employee
        </Button>
        <Button
          variant={mode === 'executive' ? 'default' : 'outline'}
          size="lg"
          onClick={() => setMode('executive')}
          disabled={disabled}
          className={`transition-all duration-300 rounded-xl border-2 shadow-lg text-lg px-6 py-3 font-bold ${
            mode === 'executive' 
              ? 'bg-gradient-to-r from-gold to-amber-500 text-white border-gold' 
              : 'bg-white/40 backdrop-blur-sm border-gold/40 text-gold hover:bg-white/60'
          }`}
        >
          <Gift className="w-6 h-6 mr-2" />
          Executive
        </Button>
      </div>
    </div>
  );
};
