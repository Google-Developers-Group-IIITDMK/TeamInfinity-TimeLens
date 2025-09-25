import React from 'react';
import { Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Photo {
  id: string
  original: string
  edited?: string
  timestamp: Date
};

interface PhotoGalleryProps {
  photos: Photo[]
  onEdit: (photoId: string) => void
  onDelete: (photoId: string) => void
};

const PhotoGallery = ({ photos, onEdit, onDelete }: PhotoGalleryProps) => {
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
        <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
          <Edit className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">No Photos Yet</h3>
        <p className="text-gray-400">Capture your first photo to create retro masterpieces!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 mb-2">Retro Gallery</h2>
        <p className="text-sm sm:text-base text-gray-400">Your premium retro masterpieces</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden bg-gray-800 border-gray-700">
            <div className="relative aspect-square">
              <img 
                src={photo.edited || photo.original} 
                alt="Photo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 sm:p-4 flex justify-between items-center">
              <div className="text-xs sm:text-sm text-gray-400">
                {new Date(photo.timestamp).toLocaleString()}
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(photo.id)}
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => downloadImage(photo.edited || photo.original, `retro-photo-${photo.id}.jpg`)}
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(photo.id)}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;