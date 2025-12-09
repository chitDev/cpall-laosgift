import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/useFullscreen';

export const FullscreenButton = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <Button
      onClick={toggleFullscreen}
      variant="outline"
      size="icon"
      className="bg-card/80 backdrop-blur-sm border-wheel-gold text-wheel-gold hover:bg-wheel-gold/20"
      title={isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
    >
      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
    </Button>
  );
};
