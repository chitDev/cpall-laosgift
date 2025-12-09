interface HeaderProps {
  isSpinning?: boolean;
  mode?: 'employee' | 'executive';
}

export const Header = ({ isSpinning = false, mode = 'employee' }: HeaderProps) => {
  if (isSpinning) {
    return null;
  }

  return (
    <header className="text-center py-2 relative">
      {/* Celebration badge */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2">
        <div className={`px-3 py-0.5 rounded-full backdrop-blur-sm border text-xs font-semibold animate-celebration-pulse shadow-lg ${
          mode === 'executive' 
            ? 'bg-gold/20 border-gold/40 text-gold' 
            : 'bg-white/20 border-white/40 text-primary'
        }`}>
          🎉 Happy New Year 2026 🎉
        </div>
      </div>
      
      {/* Horizontal logo layout */}
      <div className="flex items-center justify-center gap-3 mt-6 mb-2">
        {/* CP ALL Logo */}
        <div className={`px-3 py-1 rounded-lg shadow-lg ${
          mode === 'executive'
            ? 'bg-gradient-to-r from-gold via-amber-500 to-gold'
            : 'bg-gradient-to-r from-primary via-secondary to-accent'
        }`}>
          <span className="text-white font-black text-sm tracking-wider drop-shadow-lg">CP ALL</span>
        </div>
        
        <div className={`font-black text-lg animate-pulse ${mode === 'executive' ? 'text-gold' : 'text-secondary'}`}>×</div>
        
        {/* 7-Eleven Logo - Horizontal */}
        <div className="flex items-center shadow-lg rounded-md overflow-hidden">
          <div className={`px-2 py-1 ${mode === 'executive' ? 'bg-gold' : 'bg-primary'}`}>
            <span className="text-white font-black text-sm drop-shadow-lg">7-ELEVEN</span>
          </div>
          <div className={`px-2 py-1 ${mode === 'executive' ? 'bg-amber-600' : 'bg-accent'}`}>
            <span className="text-white font-bold text-xs">2026</span>
          </div>
        </div>
      </div>
      
      <h1 className="text-xl md:text-2xl font-black mb-1" style={{ 
        color: 'white',
        textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(173,216,230,0.6), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(100,149,237,0.4)'
      }}>
        ❄️ White In Wonderland ❄️
      </h1>
      
      <p className={`text-sm font-semibold ${mode === 'executive' ? 'text-gold' : 'text-secondary'}`}>
        {mode === 'executive' ? '🎁 สุ่มจับของขวัญจากผู้บริหาร 🎁' : '🎁 สุ่มจับของขวัญ 🎁'}
      </p>
    </header>
  );
};
