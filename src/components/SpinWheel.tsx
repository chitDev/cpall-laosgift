import { useRef, useState, useEffect, useCallback } from 'react';

interface SpinWheelProps {
  names: string[];
  onSpinEnd: (winner: string, index: number) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  soundFunctions: {
    playTick: () => void;
    playWin: () => void;
    playSpinStart: () => void;
    playSlowDown: () => void;
    lowerBackgroundVolume: () => void;
  };
}

const WHEEL_COLORS = [
  'hsl(152, 100%, 30%)',  // 7-Eleven Green
  'hsl(27, 100%, 50%)',   // 7-Eleven Orange
  'hsl(2, 77%, 50%)',     // 7-Eleven Red
  'hsl(200, 70%, 55%)',   // Ice Blue
  'hsl(280, 60%, 60%)',   // Purple
  'hsl(45, 100%, 50%)',   // Gold
];

export const SpinWheel = ({ names, onSpinEnd, isSpinning, setIsSpinning, soundFunctions }: SpinWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const { playTick, playWin, playSpinStart, playSlowDown, lowerBackgroundVolume } = soundFunctions;
  const lastTickRef = useRef(0);
  const animationRef = useRef<number>();

  const drawWheel = useCallback((ctx: CanvasRenderingContext2D, size: number, currentRotation: number) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    if (names.length === 0) return;

    const sliceAngle = (2 * Math.PI) / names.length;

    // Draw slices
    names.forEach((name, i) => {
      const startAngle = i * sliceAngle + currentRotation;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
      gradient.addColorStop(0, 'hsl(0, 0%, 95%)');
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, color);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(14, Math.min(24, radius / names.length))}px Kanit`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      
      const text = name.length > 12 ? name.substring(0, 12) + '...' : name;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 45);
    centerGradient.addColorStop(0, 'hsl(45, 100%, 65%)');
    centerGradient.addColorStop(0.5, 'hsl(45, 100%, 50%)');
    centerGradient.addColorStop(1, 'hsl(35, 100%, 40%)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = 'hsl(45, 100%, 70%)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw 7-11 text in center
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Kanit';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.fillText('7-11', centerX, centerY + 5);

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 8;
    ctx.stroke();
  }, [names]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(500, window.innerHeight * 0.55);
    canvas.width = size;
    canvas.height = size;

    drawWheel(ctx, size, rotation);
  }, [names, rotation, drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    lowerBackgroundVolume();
    playSpinStart();

    const spinDuration = 6000 + Math.random() * 2000;
    // Spin multiple full rotations plus a random amount
    const totalRotationDeg = 360 * (6 + Math.random() * 4) + Math.random() * 360;
    const sliceAngleDeg = 360 / names.length;
    
    const startTime = Date.now();
    const startRotationDeg = (rotation * 180 / Math.PI);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      const currentRotationDeg = startRotationDeg + totalRotationDeg * easeOut;
      setRotation(currentRotationDeg * (Math.PI / 180));

      // Tick sound logic
      const normalizedRotation = ((currentRotationDeg % 360) + 360) % 360;
      const currentSlice = Math.floor(normalizedRotation / sliceAngleDeg);
      if (currentSlice !== lastTickRef.current) {
        if (progress < 0.7) {
          playTick();
        } else if (progress < 0.9) {
          playSlowDown();
        }
        lastTickRef.current = currentSlice;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        playWin();
        
        // Calculate which slice is at the pointer (270° = top) based on final rotation
        // The pointer is fixed at the top (270°)
        // After rotation R, slice i occupies: [i * sliceAngle + R, (i+1) * sliceAngle + R]
        // We need to find which slice contains 270°
        // Equivalently: find which "original angle" is now at 270°
        // Original angle at pointer = (270 - R) mod 360
        const finalRotationDeg = startRotationDeg + totalRotationDeg;
        const normalizedFinal = ((finalRotationDeg % 360) + 360) % 360;
        const angleAtPointer = ((270 - normalizedFinal) % 360 + 360) % 360;
        const winningIndex = Math.floor(angleAtPointer / sliceAngleDeg) % names.length;
        
        onSpinEnd(names[winningIndex], winningIndex);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, names, rotation, onSpinEnd, playTick, playWin, playSpinStart, playSlowDown, setIsSpinning]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer */}
      <div className="absolute -top-2 z-10 transform">
        <div 
          className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-secondary drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 10px hsl(27, 100%, 50%))' }}
        />
      </div>

      {/* Wheel */}
      <canvas 
        ref={canvasRef} 
        className={`cursor-pointer transition-all duration-300 ${!isSpinning && names.length > 0 ? 'hover:scale-105' : ''}`}
        onClick={spin}
        style={{ 
          filter: isSpinning ? 'drop-shadow(0 0 30px hsl(45, 100%, 50%))' : 'drop-shadow(0 0 20px hsl(152, 100%, 26%))',
        }}
      />

      {/* Click to spin overlay */}
      {!isSpinning && names.length > 0 && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.9 }}
        >
          <div className="bg-card/90 px-6 py-3 rounded-full animate-pulse-glow border-2 border-secondary shadow-lg">
            <span className="text-secondary font-bold text-lg">คลิกเพื่อหมุน!</span>
          </div>
        </div>
      )}
    </div>
  );
};
