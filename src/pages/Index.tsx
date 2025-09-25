import React, { useState } from 'react'
import { Camera, Clock } from 'lucide-react'
import CameraComponent from '@/components/Camera'
import PhotoGallery from '@/components/PhotoGallery'
import { Button } from '@/components/ui/button'
import ApiKeyPrompt from '@/components/ApiKeyPrompt'
import { toast } from '@/hooks/use-toast'

interface Photo {
  id: string
  original: string
  past?: string
  future?: string
  timestamp: Date
}

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentView, setCurrentView] = useState<'camera' | 'gallery'>('camera')
  const [generatingPastIds, setGeneratingPastIds] = useState<string[]>([])
  const [generatingFutureIds, setGeneratingFutureIds] = useState<string[]>([])
  const [showKeyPrompt, setShowKeyPrompt] = useState(false)

  const handleCapture = (imageSrc: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      original: imageSrc,
      timestamp: new Date(),
    }
    setPhotos(prev => [newPhoto, ...prev])
    setCurrentView('gallery')
  }

  async function handleGeneratePast(photoId: string) {
    try {
      setGeneratingPastIds(prev => [...prev, photoId])
      const photo = photos.find(p => p.id === photoId)
      if (!photo) return
      const { transformImageToEra } = await import('@/lib/genai')
      const result = await transformImageToEra(photo.original, '1970')
      setPhotos(prev => prev.map(p => (p.id === photoId ? { ...p, past: result } : p)))
    } catch (e: any) {
      console.error(e)
      toast({
        title: '1970s generation failed',
        description: String(e?.message || e),
        variant: 'destructive'
      })
      if (String(e?.message || '').toLowerCase().includes('api key')) setShowKeyPrompt(true)
    } finally {
      setGeneratingPastIds(prev => prev.filter(id => id !== photoId))
    }
  }

  async function handleGenerateFuture(photoId: string) {
    try {
      setGeneratingFutureIds(prev => [...prev, photoId])
      const photo = photos.find(p => p.id === photoId)
      if (!photo) return
      const { transformImageToEra } = await import('@/lib/genai')
      const result = await transformImageToEra(photo.original, '2070')
      setPhotos(prev => prev.map(p => (p.id === photoId ? { ...p, future: result } : p)))
    } catch (e: any) {
      console.error(e)
      toast({
        title: '2070s generation failed',
        description: String(e?.message || e),
        variant: 'destructive'
      })
      if (String(e?.message || '').toLowerCase().includes('api key')) setShowKeyPrompt(true)
    } finally {
      setGeneratingFutureIds(prev => prev.filter(id => id !== photoId))
    }
  }

  return (
    <div className="min-h-screen bg-background retro-backdrop">
      {/* Header */}
      <header className="p-6 border-b border-border/50 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Camera className="w-8 h-8 text-vintage-amber rotate-slow" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-vintage-amber tracking-wide">TimeLens Emporium</h1>
              <p className="text-sm text-muted-foreground">Retro Portrait Shoppe & Castle Futures</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'camera' ? 'default' : 'outline'}
              onClick={() => setCurrentView('camera')}
              className="bg-vintage-amber hover:bg-vintage-amber/90 text-camera-body"
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>
            <Button
              variant={currentView === 'gallery' ? 'default' : 'outline'}
              onClick={() => setCurrentView('gallery')}
              className="bg-vintage-amber hover:bg-vintage-amber/90 text-camera-body"
            >
              <Clock className="w-4 h-4 mr-2" />
              Gallery ({photos.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowKeyPrompt(true)}
              className="border-vintage-amber text-vintage-amber hover:bg-vintage-amber/10"
            >
              Set API Key
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        {currentView === 'camera' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-extrabold text-vintage-amber mb-2">Vintage Castle Portraits</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Step into our retro atelier: capture today and we’ll handcraft 1970s film prints or 2070s neon futures
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-vintage-amber/70">
                <span>📸 Instant capture</span>
                <span>🔙 1970s film grain</span>
                <span>🏰 Castle backdrops</span>
                <span>🚀 2070s neon</span>
              </div>
            </div>

            {/* Camera Component */}
            <div className="flex justify-center">
              <div className="max-w-lg w-full">
                <CameraComponent onCapture={handleCapture} />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-4 text-muted-foreground">
              <p>📸 Point your camera at something interesting and press the shutter!</p>
              {photos.length === 0 && (
                <p className="text-sm">Your first capture will appear in the gallery.</p>
              )}
            </div>
          </div>
        ) : (
          <PhotoGallery
            photos={photos}
            onGeneratePast={handleGeneratePast}
            onGenerateFuture={handleGenerateFuture}
            generatingPastIds={generatingPastIds}
            generatingFutureIds={generatingFutureIds}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 p-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>✨ TimeLens - Where every moment becomes a journey through time</p>
        </div>
      </footer>
      <ApiKeyPrompt open={showKeyPrompt} onOpenChange={setShowKeyPrompt} />
    </div>
  )
}

export default Index