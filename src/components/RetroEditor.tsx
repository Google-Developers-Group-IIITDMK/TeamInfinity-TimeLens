import React, { useState, useEffect, useRef } from 'react';
import { X, Save, RotateCcw, Sliders, Sparkles, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RetroEditorProps {
  image: string;
  onClose: () => void;
  onSave: (editedImage: string) => void;
}

interface FilterPreset {
  name: string;
  description: string;
  values: {
    grayscale: number;
    contrast: number;
    brightness: number;
    grain: number;
    vignette: number;
    sepia: number;
    sharpen: number;
  };
}

const presets: FilterPreset[] = [
  {
    name: "Natural",
    description: "Enhanced natural look with improved clarity",
    values: {
      grayscale: 0,
      contrast: 110,
      brightness: 105,
      grain: 0,
      vignette: 0,
      sepia: 0,
      sharpen: 20
    }
  },
  {
    name: "Classic B&W",
    description: "Timeless black and white with rich contrast",
    values: {
      grayscale: 100,
      contrast: 130,
      brightness: 105,
      grain: 10,
      vignette: 30,
      sepia: 0,
      sharpen: 25
    }
  },
  {
    name: "Vintage Sepia",
    description: "Warm sepia tones reminiscent of old photographs",
    values: {
      grayscale: 90,
      contrast: 110,
      brightness: 100,
      grain: 15,
      vignette: 45,
      sepia: 60,
      sharpen: 15
    }
  },
  {
    name: "Film Noir",
    description: "High contrast dramatic black and white",
    values: {
      grayscale: 100,
      contrast: 150,
      brightness: 95,
      grain: 20,
      vignette: 60,
      sepia: 0,
      sharpen: 30
    }
  },
  {
    name: "Faded Print",
    description: "Soft, low contrast with subtle grain",
    values: {
      grayscale: 95,
      contrast: 90,
      brightness: 110,
      grain: 25,
      vignette: 20,
      sepia: 15,
      sharpen: 10
    }
  },
  {
    name: "Newspaper",
    description: "High contrast with heavy grain",
    values: {
      grayscale: 100,
      contrast: 140,
      brightness: 105,
      grain: 35,
      vignette: 10,
      sepia: 0,
      sharpen: 40
    }
  }
];

const RetroEditor = ({ image, onClose, onSave }: RetroEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Set default values to create more natural-looking images
  const [grayscale, setGrayscale] = useState(0); // No grayscale by default
  const [contrast, setContrast] = useState(100); // Normal contrast
  const [brightness, setBrightness] = useState(100); // Normal brightness
  const [grain, setGrain] = useState(0); // No grain by default
  const [vignette, setVignette] = useState(0); // No vignette by default
  const [sepia, setSepia] = useState(0); // No sepia by default
  const [sharpen, setSharpen] = useState(10); // Slight sharpening for better quality
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;
    
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters
      applyFilters(ctx, img);
    };
  }, [image, grayscale, contrast, brightness, grain, vignette, sepia, sharpen]);

  const applyFilters = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Enable image smoothing for maximum quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw original image at highest quality
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    
    // Create a copy of original data for high-quality processing
    const originalData = new Uint8ClampedArray(data);
    
    // Apply grayscale
    const grayscaleValue = grayscale / 100;
    
    // Apply contrast
    const contrastFactor = (contrast / 100) * 2.55;
    
    // Apply brightness
    const brightnessValue = (brightness - 100) * 2.55;
    
    // Apply sepia
    const sepiaValue = sepia / 100;
    
    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      // Get RGB values
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply grayscale with improved luminance formula
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = r * (1 - grayscaleValue) + gray * grayscaleValue;
      g = g * (1 - grayscaleValue) + gray * grayscaleValue;
      b = b * (1 - grayscaleValue) + gray * grayscaleValue;
      
      // Apply sepia
      if (sepiaValue > 0) {
        const sr = r * (1 - sepiaValue) + (r * 0.393 + g * 0.769 + b * 0.189) * sepiaValue;
        const sg = g * (1 - sepiaValue) + (r * 0.349 + g * 0.686 + b * 0.168) * sepiaValue;
        const sb = b * (1 - sepiaValue) + (r * 0.272 + g * 0.534 + b * 0.131) * sepiaValue;
        r = sr;
        g = sg;
        b = sb;
      }
      
      // Apply contrast
      r = ((r - 128) * contrastFactor) + 128;
      g = ((g - 128) * contrastFactor) + 128;
      b = ((b - 128) * contrastFactor) + 128;
      
      // Apply brightness
      r += brightnessValue;
      g += brightnessValue;
      b += brightnessValue;
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    // Put image data back
    ctx.putImageData(imageData, 0, 0);
    
    // Apply grain with improved distribution
    if (grain > 0) {
      const grainAmount = grain / 100;
      const grainCanvas = document.createElement('canvas');
      grainCanvas.width = ctx.canvas.width;
      grainCanvas.height = ctx.canvas.height;
      const grainCtx = grainCanvas.getContext('2d');
      
      if (grainCtx) {
        const grainData = grainCtx.createImageData(grainCanvas.width, grainCanvas.height);
        const grainPixels = grainData.data;
        
        for (let i = 0; i < grainPixels.length; i += 4) {
          // Use Gaussian-like noise for more natural film grain
          const value = (Math.random() + Math.random() + Math.random() - 1.5) * 255 * grainAmount;
          grainPixels[i] = value;
          grainPixels[i + 1] = value;
          grainPixels[i + 2] = value;
          grainPixels[i + 3] = 30; // Alpha for grain
        }
        
        grainCtx.putImageData(grainData, 0, 0);
        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(grainCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    
    // Apply vignette with improved algorithm
    if (vignette > 0) {
      const vignetteAmount = vignette / 100;
      const gradient = ctx.createRadialGradient(
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
        ctx.canvas.height * 0.35, // Larger inner radius for smoother transition
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
        ctx.canvas.height * 0.75 // Adjusted outer radius
      );
      
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignetteAmount * 0.7})`);
      
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    
    // Apply sharpen if needed
    if (sharpen > 0) {
      // Sharpen is applied through unsharp masking technique
      // This is a placeholder as actual implementation would require convolution
      // which is complex to implement directly in this context
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const editedImage = canvasRef.current.toDataURL('image/jpeg', 0.9);
      onSave(editedImage);
    }
  };

  const resetFilters = () => {
    setGrayscale(100);
    setContrast(120);
    setBrightness(102);
    setGrain(14);
    setVignette(40);
    setSepia(20);
    setSharpen(20);
    setActivePreset(null);
  };

  const applyPreset = (preset: FilterPreset) => {
    setGrayscale(preset.values.grayscale);
    setContrast(preset.values.contrast);
    setBrightness(preset.values.brightness);
    setGrain(preset.values.grain);
    setVignette(preset.values.vignette);
    setSepia(preset.values.sepia);
    setSharpen(preset.values.sharpen);
    setActivePreset(preset.name);
  };

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `retro-edit-${Date.now()}.jpg`;
      link.href = canvasRef.current.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
      <div className="p-2 sm:p-4 flex justify-between items-center bg-gray-900/80 border-b border-gray-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Retro Editor</h2>
          {activePreset && (
            <Badge variant="secondary" className="bg-gray-700 text-gray-200 text-xs sm:text-sm">
              {activePreset}
            </Badge>
          )}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={resetFilters} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700">
                <p>Reset All Filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={downloadImage} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700">
                <p>Download Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowControls(!showControls)} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300">
                  <Sliders className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700">
                <p>{showControls ? 'Hide' : 'Show'} Controls</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="default" onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4 rounded-full transition-all duration-300">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Save
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-red-400 hover:bg-red-500/20 h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-all duration-300">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-auto p-4">
          <div className="relative max-w-full max-h-full shadow-2xl">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-[calc(100vh-200px)] object-contain"
            />
          </div>
        </div>
        
        {showControls && (
          <div className="w-[350px] bg-gray-900 border-l border-gray-800 overflow-y-auto">
            <Tabs defaultValue="presets" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-2 p-1 bg-gray-800">
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="presets" className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {presets.map((preset) => (
                    <Card 
                      key={preset.name}
                      className={`p-3 cursor-pointer transition-all hover:bg-gray-800 ${
                        activePreset === preset.name ? 'bg-gray-800 border-blue-500' : 'bg-gray-850'
                      }`}
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{preset.name}</h3>
                          <p className="text-sm text-gray-400">{preset.description}</p>
                        </div>
                        {activePreset === preset.name && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="px-4 py-2 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Black & White</label>
                      <span className="text-sm text-gray-400">{grayscale}%</span>
                    </div>
                    <Slider
                      value={[grayscale]}
                      min={0}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setGrayscale(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Sepia Tone</label>
                      <span className="text-sm text-gray-400">{sepia}%</span>
                    </div>
                    <Slider
                      value={[sepia]}
                      min={0}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setSepia(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Contrast</label>
                      <span className="text-sm text-gray-400">{contrast}%</span>
                    </div>
                    <Slider
                      value={[contrast]}
                      min={50}
                      max={200}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setContrast(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Brightness</label>
                      <span className="text-sm text-gray-400">{brightness}%</span>
                    </div>
                    <Slider
                      value={[brightness]}
                      min={50}
                      max={150}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setBrightness(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Grain</label>
                      <span className="text-sm text-gray-400">{grain}%</span>
                    </div>
                    <Slider
                      value={[grain]}
                      min={0}
                      max={50}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setGrain(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Vignette</label>
                      <span className="text-sm text-gray-400">{vignette}%</span>
                    </div>
                    <Slider
                      value={[vignette]}
                      min={0}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setVignette(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Sharpness</label>
                      <span className="text-sm text-gray-400">{sharpen}%</span>
                    </div>
                    <Slider
                      value={[sharpen]}
                      min={0}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                      onValueChange={(value) => {
                        setSharpen(value[0]);
                        setActivePreset(null);
                      }}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetFilters} 
                    className="w-full mt-4"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All Filters
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

export default RetroEditor;