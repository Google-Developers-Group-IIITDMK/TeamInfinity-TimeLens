// Google GenAI helper for image-to-image transformations (1970s/2070s)
// Note: For demo purposes only — this exposes the API key in the browser.
// Put your key in a Vite env var: VITE_GOOGLE_API_KEY

// Using REST API directly to avoid SDK import mismatches in the browser

function getEffectiveApiKey(): string | undefined {
  const envKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined
  const storedKey = typeof window !== 'undefined' ? window.localStorage.getItem('VITE_GOOGLE_API_KEY') || undefined : undefined
  return envKey || storedKey
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent'

// Convert a data URL (data:image/jpeg;base64,...) to raw base64 without the prefix
function dataUrlToBase64(dataUrl: string): string {
  const commaIdx = dataUrl.indexOf(',')
  return commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl
}

// Build an era-specific prompt
function buildEraPrompt(era: '1970' | '2070'): string {
  if (era === '1970') {
    return [
      'Transform this photo into a 1970s retro film look.',
      'Characteristics: warm vintage tones, slight film grain, subtle vignette,',
      'soft contrast, analog color palette, mild fade, period-accurate aesthetics.',
      'Keep the subject, pose, and composition from the original image.'
    ].join(' ')
  }
  // 2070
  return [
    'Transform this photo into a 2070s futuristic aesthetic.',
    'Characteristics: clean high-contrast look, crisp details, subtle neon accents,',
    'advanced materials, slightly cool/cyan highlights with modern lighting,',
    'plausible near-future style. Keep the subject, pose, and composition.'
  ].join(' ')
}

// Perform image-to-image style transform using Gemini Image Generation
export async function transformImageToEra(dataUrl: string, era: '1970' | '2070'): Promise<string> {
  const apiKey = getEffectiveApiKey()
  if (!apiKey) throw new Error('Missing API key. Set VITE_GOOGLE_API_KEY in .env or save via settings.')

  const base64 = dataUrlToBase64(dataUrl)
  const prompt = buildEraPrompt(era)

  let json: any
  try {
    const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/jpeg', data: base64 } },
            ],
          },
        ],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      }),
    })
    json = await res.json()
    if (!res.ok) {
      throw new Error(json?.error?.message || `HTTP ${res.status}`)
    }
  } catch (err: any) {
    console.error('GenAI REST error:', err)
    throw new Error(err?.message || 'Image generation request failed')
  }

  const candidate = json?.candidates?.[0]
  const part = candidate?.content?.parts?.find((p: any) => p.inlineData)
  const img = part?.inlineData?.data
  if (!img) { console.error('No image returned from generateContent:', response); throw new Error('No image returned from generateContent') }

  // Return as a displayable data URL (PNG)
  return `data:image/png;base64,${img}`
}
