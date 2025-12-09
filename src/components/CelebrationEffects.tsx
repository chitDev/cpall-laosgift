import { useMemo } from 'react';

export const CelebrationEffects = () => {
  // Generate random stars
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 0.5 + Math.random() * 1,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, []);

  // Generate floating orbs
  const orbs = useMemo(() => {
    const orbTypes = ['orb-green', 'orb-orange', 'orb-gold', 'orb-purple'];
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      type: orbTypes[i % orbTypes.length],
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      size: 60 + Math.random() * 100,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 4,
    }));
  }, []);

  // Generate rising particles
  const particles = useMemo(() => {
    const colors = [
      'hsl(152 100% 50%)', // green
      'hsl(45 100% 60%)',  // gold
      'hsl(27 100% 55%)',  // orange
      'hsl(280 70% 60%)',  // purple
      'hsl(2 77% 55%)',    // red
    ];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      size: 4 + Math.random() * 6,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 8,
    }));
  }, []);

  return (
    <>
      {/* Twinkling Stars */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              fontSize: `${star.size}rem`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="orbs-container">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className={`orb ${orb.type}`}
            style={{
              left: orb.left,
              top: orb.top,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              animationDuration: `${orb.duration}s`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Rising Particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
              boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
