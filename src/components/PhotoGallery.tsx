import React from 'react';
import { Download, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Photo {
  id: string
  original: string
  past?: string
  future?: string
  timestamp: Date
};

interface PhotoGalleryProps {
  photos: Photo[]
  onGeneratePast: (photoId: string) => void
  onGenerateFuture: (photoId: string) => void
  generatingPastIds?: string[]
  generatingFutureIds?: string[]
};

const PhotoGallery = ({ photos, onGeneratePast, onGenerateFuture, generatingPastIds = [], generatingFutureIds = [] }: PhotoGalleryProps) => {
  const downloadImage = (imageSrc: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 mx-auto bg-camera-metal rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-vintage-amber" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Photos Yet</h3>
        <p className="text-muted-foreground">Capture your first photo to start time traveling!</p>
      </div>
    )
  }

  const isPastGenerating = (id: string) => generatingPastIds.includes(id)
  const isFutureGenerating = (id: string) => generatingFutureIds.includes(id)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-vintage-amber mb-2">Castle Gallery</h2>
        <p className="text-muted-foreground">Retro prints and future visions</p>
      </div>

      <div className="space-y-8">
        {photos.map((photo) => (
          <Card key={photo.id} className="camera-body p-6 space-y-6">
            {/* Original Photo */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-vintage-amber rounded-full" />
                <h3 className="text-lg font-semibold">Present Day</h3>
                <span className="text-sm text-muted-foreground">{photo.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img src={photo.original} alt="Original capture" className="w-full h-auto" />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => downloadImage(photo.original, `timelens-original-${photo.id}.jpg`)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Time Travel Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Past Version */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h4 className="font-semibold text-amber-500">🔙 1970s Film Print</h4>
                </div>

                <div className="relative rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                  {photo.past ? (
                    <>
                      <img src={photo.past} alt="1970s version" className="w-full h-full object-cover" />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(photo.past!, `timelens-1970s-${photo.id}.jpg`)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center space-y-3 py-6">
                      <p className="text-sm text-muted-foreground">Generate a 1970s retro version</p>
                      <Button
                        variant="secondary"
                        onClick={() => onGeneratePast(photo.id)}
                        disabled={isPastGenerating(photo.id)}
                      >
                        {isPastGenerating(photo.id) ? 'Generating…' : 'Generate 1970'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Future Version */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-semibold text-cyan-400">🚀 Travelled to 2070s</h4>
                </div>
                <div className="relative rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                  {photo.future ? (
                    <>
                      <img src={photo.future} alt="2070s version" className="w-full h-full object-cover" />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(photo.future!, `timelens-2070s-${photo.id}.jpg`)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center space-y-3 py-6">
                      <p className="text-sm text-muted-foreground">Generate a 2070s futuristic version</p>
                      <Button
                        variant="secondary"
                        onClick={() => onGenerateFuture(photo.id)}
                        disabled={isFutureGenerating(photo.id)}
                      >
                        {isFutureGenerating(photo.id) ? 'Generating…' : 'Generate 2070'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PhotoGallery;