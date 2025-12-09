import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RefreshCw, Gift, Sparkles, Star, PartyPopper, Trophy } from 'lucide-react';

interface ResultDisplayProps {
  winner: string | null;
  onRemoveAndContinue: () => void;
  onSpinAgain: () => void;
  onReset: () => void;
  isGameOver: boolean;
  mode?: 'employee' | 'executive';
}

export const ResultDisplay = ({ winner, onRemoveAndContinue, onSpinAgain, onReset, isGameOver, mode = 'employee' }: ResultDisplayProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  useEffect(() => {
    if (winner || isGameOver) {
      setShowConfetti(true);
      // Delay spotlight for dramatic effect
      const spotlightTimer = setTimeout(() => setShowSpotlight(true), 300);
      const confettiTimer = setTimeout(() => setShowConfetti(false), 10000);
      return () => {
        clearTimeout(spotlightTimer);
        clearTimeout(confettiTimer);
      };
    } else {
      setShowSpotlight(false);
    }
  }, [winner, isGameOver]);

  if (isGameOver) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary/30 via-background/98 to-secondary/30 backdrop-blur-lg flex items-center justify-center z-50">
        {showConfetti && <Confetti count={120} />}
        <Fireworks count={12} />
        <FloatingStars count={30} />
        <SpotlightBeams />
        <div className="text-center animate-bounce-in relative">
          <div className="absolute -inset-20 bg-gradient-to-r from-primary/20 via-gold/30 to-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative">
            <div className="text-9xl mb-8 animate-float">🎊</div>
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-gold to-secondary mb-6 animate-shimmer" style={{ backgroundSize: '200% 100%' }}>
              🎉 จบเกม! 🎉
            </h2>
            <p className="text-3xl text-foreground mb-10 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-gold animate-pulse" />
              ขอบคุณทุกคนที่ร่วมสนุก
              <Sparkles className="w-8 h-8 text-gold animate-pulse" />
            </p>
            <Button 
              onClick={onReset}
              className="bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-2xl px-10 py-8 rounded-2xl shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-7 h-7 mr-3" />
              เริ่มเกมใหม่
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!winner) return null;

  const bgGradient = mode === 'executive' 
    ? 'from-gold/20 via-background/98 to-amber-500/20' 
    : 'from-gold/15 via-background/98 to-magic/15';

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${bgGradient} backdrop-blur-lg flex items-center justify-center z-50 overflow-hidden`}>
      {showConfetti && <Confetti count={100} />}
      <Fireworks count={10} />
      <FloatingStars count={25} />
      <GlowingOrbs />
      {showSpotlight && <SpotlightBeams />}
      <RisingSparkles />
      
      <div className="text-center animate-bounce-in max-w-3xl mx-4 relative">
        {/* Pulsing glow background */}
        <div className="absolute -inset-40 bg-gradient-to-r from-gold/30 via-secondary/30 to-magic/30 rounded-full blur-3xl animate-pulse" />
        
        {/* Rotating ring effect */}
        <div className="absolute -inset-20 border-4 border-dashed border-gold/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute -inset-16 border-4 border-dashed border-secondary/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        
        {/* Main content card */}
        <div className="relative glass rounded-3xl p-10 md:p-14 border-2 border-gold/40 shadow-2xl overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-[-2px] bg-gradient-to-r from-primary via-gold to-secondary opacity-50 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute inset-[2px] bg-gradient-to-br from-white/95 to-white/90 rounded-3xl backdrop-blur-sm" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Trophy and celebration icons */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <PartyPopper className="w-12 h-12 text-secondary animate-bounce" style={{ animationDelay: '0.1s' }} />
              <Trophy className="w-16 h-16 text-gold animate-pulse" />
              <PartyPopper className="w-12 h-12 text-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            
            {/* Gift icon with spectacular glow */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gold/50 rounded-full blur-3xl animate-pulse scale-[2]" />
              <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl animate-pulse scale-150" style={{ animationDelay: '0.5s' }} />
              <div className="relative text-8xl md:text-9xl animate-float">
                🎁
              </div>
            </div>
            
            {/* Label with icons */}
            <p className={`text-2xl md:text-3xl text-foreground mb-4 flex items-center justify-center gap-3 font-semibold`}>
              {mode === 'executive' ? (
                <>
                  <Trophy className="w-7 h-7 text-gold animate-pulse" />
                  <span>ผู้โชคดีได้แก่</span>
                  <Trophy className="w-7 h-7 text-gold animate-pulse" />
                </>
              ) : (
                <>
                  <Gift className="w-7 h-7 text-secondary animate-pulse" />
                  <span>คุณได้รับของขวัญจาก</span>
                  <Gift className="w-7 h-7 text-secondary animate-pulse" />
                </>
              )}
            </p>
            
            {/* Winner name - SPECTACULAR */}
            <div className="relative my-6 py-6">
              {/* Background glow layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent blur-2xl animate-pulse" style={{ animationDelay: '0.3s' }} />
              
              {/* Name with enhanced styling */}
              <h2 className="relative text-6xl md:text-8xl font-black break-words leading-tight" style={{ 
                background: 'linear-gradient(135deg, hsl(152 100% 30%) 0%, hsl(152 100% 40%) 30%, hsl(45 100% 45%) 70%, hsl(27 100% 50%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}>
                {winner}
              </h2>
              
              {/* Decorative underline */}
              <div className="mt-4 mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
            </div>
            
            {/* Celebration text with sparkles */}
            <div className="flex items-center justify-center gap-3 mb-8 text-xl md:text-2xl">
              <Star className="w-6 h-6 text-gold animate-spin" style={{ animationDuration: '3s' }} />
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              <span className="text-foreground font-medium">🎉 ยินดีด้วย! 🎉</span>
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              <Star className="w-6 h-6 text-gold animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            </div>
            
            {/* Action buttons - stacked and centered */}
            <div className="flex flex-col items-center gap-4">
              {/* ปุ่มหลัก - ยืนยันและหมุนต่อ */}
              <Button 
                onClick={onRemoveAndContinue}
                className="bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-xl md:text-2xl px-8 md:px-12 py-7 md:py-8 rounded-2xl shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-110 animate-celebration-pulse ring-4 ring-primary/30"
              >
                <Sparkles className="w-6 h-6 mr-2 md:mr-3" />
                ✅ ยืนยันและหมุนต่อ
              </Button>
              
              {/* ปุ่มรอง - ได้ชื่อตัวเอง */}
              <Button 
                onClick={onSpinAgain}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-base px-6 py-4 rounded-xl transition-all duration-300 hover:bg-muted/30"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                ได้ชื่อตัวเอง? หมุนใหม่
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Confetti with more pieces and variety
const Confetti = ({ count = 80 }: { count?: number }) => {
  const shapes = ['square', 'circle', 'triangle'];
  const confettiPieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    color: ['#00844a', '#ff7300', '#e1251b', '#ffd700', '#87ceeb', '#ffffff', '#ff69b4', '#9370db', '#00CED1', '#FFD700'][Math.floor(Math.random() * 10)],
    size: 6 + Math.random() * 14,
    rotation: Math.random() * 360,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'triangle' ? '0' : '2px',
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`,
            boxShadow: `0 0 10px ${piece.color}`,
            clipPath: piece.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Fireworks
const Fireworks = ({ count = 8 }: { count?: number }) => {
  const fireworks = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    top: 5 + Math.random() * 50,
    delay: Math.random() * 3,
    color: ['hsl(45 100% 50%)', 'hsl(152 100% 40%)', 'hsl(27 100% 50%)', 'hsl(280 70% 60%)', 'hsl(0 100% 60%)'][i % 5],
    size: 4 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute rounded-full"
          style={{
            left: `${fw.left}%`,
            top: `${fw.top}%`,
            width: `${fw.size}px`,
            height: `${fw.size}px`,
            background: `radial-gradient(circle, ${fw.color}, transparent)`,
            boxShadow: `0 0 40px 20px ${fw.color}`,
            animation: `sparkle 1.5s ease-in-out ${fw.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Floating Stars
const FloatingStars = ({ count = 20 }: { count?: number }) => {
  const starChars = ['✦', '✧', '★', '✨', '⭐'];
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    size: 0.6 + Math.random() * 1.4,
    char: starChars[Math.floor(Math.random() * starChars.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute text-gold"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            fontSize: `${star.size}rem`,
            animation: `sparkle 2s ease-in-out ${star.delay}s infinite`,
            filter: 'drop-shadow(0 0 10px hsl(45 100% 50%))',
          }}
        >
          {star.char}
        </div>
      ))}
    </div>
  );
};

// Glowing Orbs
const GlowingOrbs = () => {
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: ['hsl(45 100% 50% / 0.4)', 'hsl(280 70% 60% / 0.3)', 'hsl(152 100% 40% / 0.3)', 'hsl(27 100% 50% / 0.4)'][i % 4],
    size: 80 + Math.random() * 180,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: orb.color,
            animation: `float 5s ease-in-out ${orb.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Spotlight beams effect
const SpotlightBeams = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute top-0 left-1/4 w-32 h-[200%] bg-gradient-to-b from-gold/20 via-gold/5 to-transparent blur-3xl transform -rotate-12 animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <div 
        className="absolute top-0 right-1/4 w-32 h-[200%] bg-gradient-to-b from-secondary/20 via-secondary/5 to-transparent blur-3xl transform rotate-12 animate-pulse"
        style={{ animationDuration: '3s', animationDelay: '1s' }}
      />
      <div 
        className="absolute top-0 left-1/2 w-40 h-[200%] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl transform -translate-x-1/2 animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '0.5s' }}
      />
    </div>
  );
};

// Rising sparkles effect
const RisingSparkles = () => {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 4 + Math.random() * 8,
    color: ['hsl(45 100% 60%)', 'hsl(152 100% 50%)', 'hsl(27 100% 55%)', 'hsl(280 70% 60%)'][i % 4],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: `0 0 15px ${s.color}, 0 0 30px ${s.color}`,
            animation: `rise-particle ${s.duration}s ease-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};
