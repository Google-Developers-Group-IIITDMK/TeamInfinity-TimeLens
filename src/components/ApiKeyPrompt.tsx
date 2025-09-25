import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ApiKeyPromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STORAGE_KEY = 'VITE_GOOGLE_API_KEY'

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ open, onOpenChange }) => {
  const [value, setValue] = React.useState<string>('')

  React.useEffect(() => {
    if (open) {
      const existing = window.localStorage.getItem(STORAGE_KEY) || ''
      setValue(existing)
    }
  }, [open])

  function handleSave() {
    try {
      if (!value.trim()) {
        window.localStorage.removeItem(STORAGE_KEY)
      } else {
        window.localStorage.setItem(STORAGE_KEY, value.trim())
      }
      onOpenChange(false)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to save API key', e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">Google AI API Key</h3>
          <p className="text-sm text-muted-foreground mt-1">Paste your Gemini API key. It will be stored in localStorage.</p>
        </div>
        <div className="p-5 space-y-3">
          <Input
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="password"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-vintage-amber text-camera-body hover:bg-vintage-amber/90">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApiKeyPrompt


