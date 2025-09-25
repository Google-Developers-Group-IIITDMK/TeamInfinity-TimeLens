// Google GenAI helper for image-to-image transformations (1970s/2070s)
// Note: For demo purposes only — this exposes the API key in the browser.
// Put your key in a Vite env var: VITE_GOOGLE_API_KEY

import { GoogleGenAI, RawReferenceImage } from '@google/genai'

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined

if (!apiKey) {
  // Surface a clear error in dev if the key is missing
  // eslint-disable-next-line no-console
  console.warn('VITE_GOOGLE_API_KEY is not set. Imagen editing will be disabled.')
}

export const ai = new GoogleGenAI({ apiKey })

// Convert a data URL (data:image/jpeg;base64,...) to raw base64 without the prefix
function dataUrlToBase64(dataUrl: string): string {
  const commaIdx = dataUrl.indexOf(',')
  return commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl
}

// Build an era-specific prompt
function buildEraPrompt(era: '1970' | '2070'): string {
  if (era === '1970') {
    return [
      'Transform this reference photo into a 1970s retro film look.',
      'Characteristics: warm vintage tones, slight film grain, subtle vignette,',
      'soft contrast, analog color palette, mild fade, period-accurate aesthetics.',
      'Keep the subject, pose, and composition from the reference image.'
    ].join(' ')
  }
  // 2070
  return [
    'Transform this reference photo into a 2070s futuristic aesthetic.',
    'Characteristics: clean high-contrast look, crisp details, subtle neon accents,',
    'advanced materials, slightly cool/cyan highlights with modern lighting,',
    'plausible near-future style. Keep the subject, pose, and composition.'
  ].join(' ')
}

// Perform image-to-image style transform using Imagen Edit
export async function transformImageToEra(dataUrl: string, era: '1970' | '2070'): Promise<string> {
  if (!apiKey) throw new Error('Missing VITE_GOOGLE_API_KEY')

  const base64 = dataUrlToBase64(dataUrl)

  // Create raw reference image from the captured photo
  const raw = new RawReferenceImage()
  raw.referenceImage = { imageBytes: base64 }

  const prompt = buildEraPrompt(era)

  const response = await ai.models.editImage({
    // Imagen 3 edit model (supports referenceImages editing)
    model: 'imagen-3.0-capability-001',
    prompt,
    referenceImages: [raw],
    config: {
      numberOfImages: 1,
      // Safety and defaults left minimal for demo
    }
  })

  const img = response?.generatedImages?.[0]?.image?.imageBytes
  if (!img) throw new Error('No image returned from editImage')

  // Return as a displayable data URL (PNG)
  return `data:image/png;base64,${img}`
}