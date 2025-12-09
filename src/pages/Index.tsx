import { useState, useEffect, useCallback } from 'react';
import { SpinWheel } from '@/components/SpinWheel';
import { NameInput } from '@/components/NameInput';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Header } from '@/components/Header';
import { FullscreenButton } from '@/components/FullscreenButton';
import { SettingsMenu } from '@/components/SettingsMenu';
import { CelebrationEffects } from '@/components/CelebrationEffects';
import { ModeSelector, GameMode } from '@/components/ModeSelector';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import { Music, Volume2 } from 'lucide-react';

const STORAGE_KEY = 'spinwheel_data';
const UNDO_STORAGE_KEY = 'spinwheel_undo';
const MODE_STORAGE_KEY = 'spinwheel_mode';

interface StoredData {
  names: string[];
  isGameOver: boolean;
}

const loadFromStorage = (mode: GameMode): StoredData | null => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${mode}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return null;
};

const saveToStorage = (data: StoredData, mode: GameMode) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${mode}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
};

const clearStorage = (mode: GameMode) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${mode}`);
    localStorage.removeItem(`${UNDO_STORAGE_KEY}_${mode}`);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
};

const saveUndoState = (data: StoredData, mode: GameMode) => {
  try {
    localStorage.setItem(`${UNDO_STORAGE_KEY}_${mode}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save undo state:', e);
  }
};

const loadUndoState = (mode: GameMode): StoredData | null => {
  try {
    const data = localStorage.getItem(`${UNDO_STORAGE_KEY}_${mode}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load undo state:', e);
  }
  return null;
};

const loadMode = (): GameMode => {
  try {
    const mode = localStorage.getItem(MODE_STORAGE_KEY);
    if (mode === 'executive' || mode === 'employee') {
      return mode;
    }
  } catch (e) {
    console.error('Failed to load mode:', e);
  }
  return 'employee';
};

const Index = () => {
  const [mode, setMode] = useState<GameMode>(loadMode);
  const [names, setNames] = useState<string[]>(() => {
    const stored = loadFromStorage(loadMode());
    return stored?.names || [];
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(() => {
    const stored = loadFromStorage(loadMode());
    return stored?.isGameOver || false;
  });
  const [canUndo, setCanUndo] = useState(() => loadUndoState(loadMode()) !== null);
  const { playTick, playWin, playSpinStart, playSlowDown, playGameOver, toggleBackgroundMusic, isMusicPlaying, lowerBackgroundVolume, restoreBackgroundVolume } = useSound();

  // Handle mode change
  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
    
    // Load data for the new mode
    const stored = loadFromStorage(newMode);
    setNames(stored?.names || []);
    setIsGameOver(stored?.isGameOver || false);
    setCanUndo(loadUndoState(newMode) !== null);
    setCurrentWinner(null);
    setWinnerIndex(null);
  };

  // Save to localStorage whenever names or game state changes
  useEffect(() => {
    saveToStorage({ names, isGameOver }, mode);
  }, [names, isGameOver, mode]);

  const handleSpinEnd = (winner: string, index: number) => {
    setCurrentWinner(winner);
    setWinnerIndex(index);
  };

  const handleRemoveAndContinue = () => {
    restoreBackgroundVolume();
    if (winnerIndex !== null) {
      // Save current state for undo before removing
      saveUndoState({ names, isGameOver }, mode);
      setCanUndo(true);
      
      const newNames = names.filter((_, i) => i !== winnerIndex);
      setNames(newNames);
      setCurrentWinner(null);
      setWinnerIndex(null);

      if (newNames.length === 0) {
        setIsGameOver(true);
        playGameOver();
      }
    }
  };

  const handleSpinAgain = () => {
    restoreBackgroundVolume();
    setCurrentWinner(null);
    setWinnerIndex(null);
  };

  const handleReset = () => {
    clearStorage(mode);
    setNames([]);
    setCurrentWinner(null);
    setWinnerIndex(null);
    setIsGameOver(false);
    setCanUndo(false);
  };

  const handleUndo = useCallback(() => {
    const undoData = loadUndoState(mode);
    if (undoData) {
      setNames(undoData.names);
      setIsGameOver(undoData.isGameOver);
      setCurrentWinner(null);
      setWinnerIndex(null);
      localStorage.removeItem(`${UNDO_STORAGE_KEY}_${mode}`);
      setCanUndo(false);
    }
  }, [mode]);

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${
      mode === 'executive' 
        ? 'bg-gradient-to-br from-amber-900/20 via-background to-gold/10' 
        : 'animated-gradient-bg'
    }`}>
      {/* Celebration Effects */}
      <CelebrationEffects />
      
      {/* Control buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={toggleBackgroundMusic}
          variant="outline"
          size="icon"
          className="bg-card/80 backdrop-blur-sm border-primary text-primary hover:bg-primary/10 shadow-lg"
          title={isMusicPlaying ? 'ปิดเพลง' : 'เปิดเพลง'}
        >
          {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        </Button>
        <SettingsMenu onReset={handleReset} mode={mode} setMode={handleModeChange} disabled={isSpinning || names.length > 0} />
        <FullscreenButton />
      </div>

      {/* Snowflakes */}
      <div className="snowflakes">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${0.8 + Math.random() * 0.8}rem`,
            }}
          >
            {mode === 'executive' 
              ? (i % 3 === 0 ? '✦' : i % 3 === 1 ? '⭐' : '✧')
              : (i % 3 === 0 ? '❄' : i % 3 === 1 ? '✦' : '❅')
            }
          </div>
        ))}
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 sparkle-bg opacity-40 pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: mode === 'executive'
            ? 'radial-gradient(circle at 50% 20%, hsl(45 100% 50% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(35 100% 40% / 0.1) 0%, transparent 40%)'
            : 'radial-gradient(circle at 50% 20%, hsl(152 100% 26% / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(27 100% 50% / 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 70%, hsl(2 77% 49% / 0.08) 0%, transparent 40%), radial-gradient(circle at 70% 30%, hsl(45 100% 50% / 0.08) 0%, transparent 35%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - hidden when spinning */}
        <div className={`transition-all duration-500 ${isSpinning ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <Header isSpinning={isSpinning} mode={mode} />
        </div>
        
        {/* Wheel section - centered and enlarged when spinning */}
        <main className={`flex-1 flex flex-col items-center justify-center px-4 transition-all duration-500 ${isSpinning ? 'py-4' : 'py-2'}`}>
          <div className={`transition-all duration-500 ${isSpinning ? 'scale-125' : 'scale-100'}`}>
            <SpinWheel 
              names={names}
              onSpinEnd={handleSpinEnd}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
              soundFunctions={{ playTick, playWin, playSpinStart, playSlowDown, lowerBackgroundVolume }}
            />
          </div>

          {/* Input section - below wheel, hidden when spinning */}
          <div className={`w-full max-w-md mt-4 transition-all duration-500 ${isSpinning ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <NameInput 
              names={names}
              setNames={setNames}
              disabled={isSpinning}
            />
          </div>
        </main>

        {/* Footer - hidden when spinning */}
        <footer className={`text-center py-2 text-sm transition-all duration-500 ${isSpinning ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <p className={`font-semibold ${mode === 'executive' ? 'text-gold' : 'text-celebration'}`}>
            🎆 White In Wonderland - CP ALL x 7-Eleven 2026 🎆
          </p>
        </footer>
      </div>

      {/* Result overlay */}
      <ResultDisplay 
        winner={currentWinner}
        onRemoveAndContinue={handleRemoveAndContinue}
        onSpinAgain={handleSpinAgain}
        onReset={handleReset}
        isGameOver={isGameOver}
        mode={mode}
      />
    </div>
  );
};

export default Index;
