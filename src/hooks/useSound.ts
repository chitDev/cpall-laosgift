import { useCallback, useRef, useState, useEffect } from 'react';

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const winnerSoundRef = useRef<HTMLAudioElement | null>(null);
  const awardSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const normalVolumeRef = useRef(0.5);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playTick = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const freq = 600 + Math.random() * 800;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.05);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  const lowerBackgroundVolume = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.15;
    }
  }, []);

  const restoreBackgroundVolume = useCallback(() => {
    // Stop award sound if playing
    if (awardSoundRef.current) {
      awardSoundRef.current.pause();
      awardSoundRef.current.currentTime = 0;
    }
    // Resume background music at normal volume
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = normalVolumeRef.current;
      bgMusicRef.current.play();
    }
  }, []);

  const playWin = useCallback(() => {
    // Pause background music completely during winner/award
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    // Play winner sound
    if (!winnerSoundRef.current) {
      winnerSoundRef.current = new Audio('/sounds/Winner.mp3');
    }
    winnerSoundRef.current.currentTime = 0;
    winnerSoundRef.current.play();

    // After winner sound ends, play award sound (loops)
    winnerSoundRef.current.onended = () => {
      if (!awardSoundRef.current) {
        awardSoundRef.current = new Audio('/sounds/Award.mp3');
        awardSoundRef.current.loop = true;
        awardSoundRef.current.volume = 0.6;
      }
      awardSoundRef.current.currentTime = 0;
      awardSoundRef.current.play();
    };
  }, []);

  const playGameOver = useCallback(() => {
    const ctx = getAudioContext();
    
    const notes = [
      { freq: 523.25, time: 0, duration: 0.3 },
      { freq: 659.25, time: 0.25, duration: 0.3 },
      { freq: 783.99, time: 0.5, duration: 0.3 },
      { freq: 1046.50, time: 0.75, duration: 0.6 },
    ];
    
    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      const startTime = ctx.currentTime + time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const sparkle = ctx.createOscillator();
        const sparkleGain = ctx.createGain();
        sparkle.connect(sparkleGain);
        sparkleGain.connect(ctx.destination);
        
        sparkle.frequency.value = 1500 + Math.random() * 2500;
        sparkle.type = 'sine';
        
        sparkleGain.gain.setValueAtTime(0.06, ctx.currentTime);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        sparkle.start(ctx.currentTime);
        sparkle.stop(ctx.currentTime + 0.15);
      }, 1000 + i * 150);
    }
  }, [getAudioContext]);

  const playSpinStart = useCallback(() => {
    const ctx = getAudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    for (let i = 0; i < 3; i++) {
      const beep = ctx.createOscillator();
      const beepGain = ctx.createGain();
      beep.connect(beepGain);
      beepGain.connect(ctx.destination);

      beep.frequency.value = 800 + i * 200;
      beep.type = 'square';

      const startTime = ctx.currentTime + i * 0.08;
      beepGain.gain.setValueAtTime(0.1, startTime);
      beepGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      beep.start(startTime);
      beep.stop(startTime + 0.08);
    }
  }, [getAudioContext]);

  const playSlowDown = useCallback(() => {
    const ctx = getAudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }, [getAudioContext]);

  const startBackgroundMusic = useCallback(() => {
    if (isMusicPlaying) return;
    
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio('/sounds/Background.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }
    
    bgMusicRef.current.play();
    setIsMusicPlaying(true);
  }, [isMusicPlaying]);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
  }, []);

  const toggleBackgroundMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  }, [isMusicPlaying, startBackgroundMusic, stopBackgroundMusic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (winnerSoundRef.current) {
        winnerSoundRef.current.pause();
        winnerSoundRef.current = null;
      }
      if (awardSoundRef.current) {
        awardSoundRef.current.pause();
        awardSoundRef.current = null;
      }
    };
  }, []);

  return { 
    playTick, 
    playWin, 
    playGameOver, 
    playSpinStart, 
    playSlowDown,
    toggleBackgroundMusic,
    isMusicPlaying,
    lowerBackgroundVolume,
    restoreBackgroundVolume
  };
};
