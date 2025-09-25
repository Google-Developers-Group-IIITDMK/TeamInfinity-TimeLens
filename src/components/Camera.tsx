import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

const Camera = ({ onCapture }: CameraProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Flash animation
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);
      
      // Camera shutter sound (using Web Audio API)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <CameraIcon className="w-12 h-12 mx-auto text-vintage-amber animate-pulse" />
          <p className="text-muted-foreground">Requesting camera access...</p>
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center space-y-4 camera-body">
          <CameraIcon className="w-12 h-12 mx-auto text-destructive" />
          <h3 className="text-lg font-semibold">Camera Access Denied</h3>
          <p className="text-muted-foreground">
            Please allow camera access to use TimeLens
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Flash overlay */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white flash-animation rounded-2xl z-10 pointer-events-none" />
      )}
      
      {/* DSLR Camera Body */}
      <div className="relative dslr-body rounded-lg film-grain">
        {/* Top Camera Body */}
        <div className="camera-top rounded-t-lg p-2 sm:p-4 relative">
          {/* Viewfinder Prism */}
          <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-4 sm:h-6 viewfinder-prism rounded-sm"></div>
          
          {/* Camera Brand */}
          <div className="absolute top-0 sm:top-1 left-1/2 transform -translate-x-1/2 text-vintage-amber font-bold text-[10px] sm:text-xs tracking-widest">
            TimeLens
          </div>
          
          {/* Hot Shoe */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 h-1 sm:h-2 hot-shoe"></div>
          
          {/* Control Dial */}
          <div className="absolute top-2 sm:top-3 right-3 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 control-dial rounded-full"></div>
          <div className="absolute top-3 sm:top-5 right-4 sm:right-6 w-3 sm:w-4 h-3 sm:h-4 bg-camera-metal rounded-full"></div>
          
          {/* Power LED */}
          <div className="absolute top-3 sm:top-4 right-12 sm:right-16 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-destructive rounded-full animate-pulse"></div>
          
          {/* Mode Settings */}
          <div className="absolute top-1 sm:top-2 left-3 sm:left-4 text-[8px] sm:text-[10px] text-vintage-amber/70 font-mono">
            AUTO
          </div>
        </div>
        
        {/* Main Camera Body */}
        <div className="camera-main p-4 sm:p-6 pt-2 sm:pt-4">
          {/* Lens Mount Ring */}
          <div className="lens-mount rounded-full p-2 sm:p-3 mx-auto mb-2 sm:mb-4 relative">
            {/* Lens Ring Markings */}
            <div className="absolute inset-0 rounded-full border-2 border-camera-metal/30"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 sm:h-3 bg-vintage-amber/50"></div>
            
            {/* Lens */}
            <div className="camera-lens-outer rounded-full p-1 sm:p-2">
              <div className="camera-lens-inner rounded-full p-1">
                {/* LCD Screen/Viewfinder */}
                <div className="relative lcd-screen rounded-lg overflow-hidden aspect-[4/3]">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: facingMode,
                      width: 1280,
                      height: 720,
                    }}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Camera Controls Overlay */}
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 space-y-1 sm:space-y-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={toggleCamera}
                      className="bg-black/50 hover:bg-black/70 border-0 h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  
                  {/* Viewfinder Grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-white/20"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className="flex items-center justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-4">
            {/* Shutter Button */}
            <button
              onClick={capture}
              className="shutter-button w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 border-white/20 flex items-center justify-center"
              aria-label="Take photo"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full"></div>
            </button>
          </div>
          
          {/* Camera Details */}
          <div className="flex justify-between items-center mt-2 sm:mt-4 text-[10px] sm:text-xs text-vintage-amber/70">
            <span>f/2.8</span>
            <span>ISO 400</span>
            <span>1/60s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;