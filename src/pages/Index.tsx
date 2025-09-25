import React, { useState, useRef } from 'react'
import { Camera, Image, Grid, Upload, X } from 'lucide-react'
import CameraComponent from '@/components/Camera'
import PhotoGallery from '@/components/PhotoGallery'
import RetroEditor from '@/components/RetroEditor'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface Photo {
  id: string
  original: string
  edited?: string
  timestamp: Date
  name?: string
}

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentView, setCurrentView] = useState<'camera' | 'gallery' | 'upload'>('camera')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorImage, setEditorImage] = useState<string | null>(null)
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCapture = (imageSrc: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      original: imageSrc,
      timestamp: new Date(),
      name: `Capture_${new Date().toLocaleString().replace(/[/\\:]/g, '-')}`
    }
    setPhotos(prev => [newPhoto, ...prev])
    
    // Automatically open the editor for the new photo
    setCurrentEditingId(newPhoto.id)
    setEditorImage(imageSrc)
    setEditorOpen(true)
  }

  const openEditor = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId)
    if (!photo) return
    setCurrentEditingId(photoId)
    setEditorImage(photo.edited || photo.original)
    setEditorOpen(true)
  }
  
  const handleSaveEdit = (editedImage: string) => {
    if (!currentEditingId) return
    
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === currentEditingId 
          ? { ...photo, edited: editedImage } 
          : photo
      )
    )
    
    setEditorOpen(false)
    setCurrentView('gallery')
    toast({
      title: "Photo Saved",
      description: "Your retro masterpiece has been saved successfully.",
      variant: "success"
    })
  }
  
  const closeEditor = () => {
    setEditorOpen(false)
    setCurrentEditingId(null)
    if (photos.length > 0 && !photos[0].edited) {
      setCurrentView('gallery')
    }
  }

  // Photo deletion handler
  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId))
    toast({
      title: "Photo Deleted",
      description: "Your photo has been removed from the gallery.",
      variant: "destructive"
    })
  }

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0])
    }
  }

  const processUploadedFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          original: e.target.result,
          timestamp: new Date(),
          name: file.name
        }
        setPhotos(prev => [newPhoto, ...prev])
        
        // Automatically open the editor for the new photo
        setCurrentEditingId(newPhoto.id)
        setEditorImage(e.target.result)
        setEditorOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <header className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 backdrop-blur-sm shadow-md">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Time Lens Captures</h1>
          <p className="text-sm text-gray-300">Premium Retro Photo Editor</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant={currentView === 'camera' ? "default" : "outline"} 
            size="sm"
            className={`rounded-full px-4 py-2 transition-all duration-300 ${currentView === 'camera' ? 'bg-purple-600 hover:bg-purple-700' : 'hover:text-purple-400 hover:border-purple-400'}`}
            onClick={() => setCurrentView('camera')}
          >
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </Button>
          <Button 
            variant={currentView === 'gallery' ? "default" : "outline"} 
            size="sm"
            className={`rounded-full px-4 py-2 transition-all duration-300 ${currentView === 'gallery' ? 'bg-purple-600 hover:bg-purple-700' : 'hover:text-purple-400 hover:border-purple-400'}`}
            onClick={() => setCurrentView('gallery')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Gallery
          </Button>
          <Button 
            variant={currentView === 'upload' ? "default" : "outline"} 
            size="sm"
            className={`rounded-full px-4 py-2 transition-all duration-300 ${currentView === 'upload' ? 'bg-purple-600 hover:bg-purple-700' : 'hover:text-purple-400 hover:border-purple-400'}`}
            onClick={() => setCurrentView('upload')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 max-w-6xl">
        <div className="flex justify-center mb-6 sm:mb-10">
          <div className="flex gap-1 sm:gap-3 p-1 sm:p-1.5 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-xl border border-gray-700">
            <Button
              variant={currentView === 'camera' ? 'default' : 'ghost'}
              className={`${currentView === 'camera' ? 'bg-purple-600 shadow-inner' : ''} px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-full`}
              onClick={() => setCurrentView('camera')}
            >
              <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Camera
            </Button>
            <Button
              variant={currentView === 'upload' ? 'default' : 'ghost'}
              className={`${currentView === 'upload' ? 'bg-purple-600 shadow-inner' : ''} px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-full`}
              onClick={() => setCurrentView('upload')}
            >
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Upload
            </Button>
            <Button
              variant={currentView === 'gallery' ? 'default' : 'ghost'}
              className={`${currentView === 'gallery' ? 'bg-purple-600 shadow-inner' : ''} px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-full`}
              onClick={() => setCurrentView('gallery')}
              disabled={photos.length === 0}
            >
              <Grid className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Gallery
            </Button>
          </div>
        </div>

        {currentView === 'camera' ? (
          <CameraComponent onCapture={handleCapture} />
        ) : currentView === 'upload' ? (
          <div 
            className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all duration-200 ${
              isDragging ? 'border-blue-500 bg-blue-900 bg-opacity-10' : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileSelect}
            />
            <Image className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Upload Your Photos</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
              Drag and drop your images here, or click the button below to browse your files
            </p>
            <Button 
              onClick={triggerFileInput}
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 px-4 sm:px-6 py-3 sm:py-5 text-sm sm:text-base"
            >
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Select Image
            </Button>
          </div>
        ) : (
          <PhotoGallery
            photos={photos}
            onEdit={openEditor}
            onDelete={handleDeletePhoto}
          />
        )}
      </div>

      {editorOpen && editorImage && (
        <RetroEditor
          image={editorImage}
          onClose={closeEditor}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default Index