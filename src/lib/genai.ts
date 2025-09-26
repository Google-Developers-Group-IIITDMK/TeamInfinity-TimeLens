// Google GenAI helper for image-to-image transformations (1970s/2070s)
// Also: OpenAI helper for meme template selection (Roastly)
import OpenAI from 'openai'

function getOpenAiKey(): string | undefined {
  const vite = (import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_OPENAI_API_KEY as string | undefined
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('VITE_OPENAI_API_KEY') || undefined : undefined
  return vite || stored
}

export async function pickMemeWithOpenAI(captionHints: string, candidateTemplates: { id: string; name: string; imageUrl: string }[], imageDescription: string): Promise<{ id: string; name: string; imageUrl: string } | null> {
  try {
    const key = getOpenAiKey()
    if (!key) throw new Error('Missing OpenAI key. Set VITE_OPENAI_API_KEY or save in localStorage.')
    const client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true })
    const system = 'You are a meme sommelier. Given a user photo description and candidate meme templates, return the single best matching template id. Answer only with the id.'
    const list = candidateTemplates.map(t => `- ${t.id}: ${t.name}`).join('\n')
    const user = `Photo vibes: ${imageDescription}\nCandidate templates:\n${list}\nHints: ${captionHints}\nReturn only the ID.`
    const r = await client.responses.create({ model: 'gpt-4o-mini', input: [{ role: 'system', content: system }, { role: 'user', content: user }] })
    const text = (r as unknown as { output_text?: string })?.output_text?.trim() || ''
    const found = candidateTemplates.find(t => t.id === text)
    return found || candidateTemplates[0] || null
  } catch (e) {
    console.warn('OpenAI selection failed; falling back to first candidate', e)
    return candidateTemplates[0] || null
  }
}
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
      'Transform this photo into a faithful 1970s film photograph.',
      'Color grade only: warm vintage tones, gentle film grain, subtle vignette,',
      'analog palette, mild fade. Emulate Kodak/Agfa stock from the era.',
      'STRICT: Do NOT move, rotate, mirror, crop, or recompose the subject.',
      'Do NOT add or remove objects. Preserve pose, framing, and geometry exactly.'
    ].join(' ')
  }
  // 2070
  return [
    'Transform this photo into a faithful 2070s futuristic aesthetic.',
    'Color/lighting only: clean high-contrast look, crisp details, subtle neon accents,',
    'advanced materials feel, slightly cool/cyan highlights with modern lighting.',
    'STRICT: Do NOT move, rotate, mirror, crop, or recompose the subject.',
    'Do NOT add or remove objects. Preserve pose, framing, and geometry exactly.'
  ].join(' ')
}

// Perform image-to-image style transform using Gemini Image Generation
// Deprecated remote transform; kept for reference. App now uses local editor.
export async function transformImageToEra(dataUrl: string, era: '1970' | '2070'): Promise<string> {
  const apiKey = getEffectiveApiKey()
  if (!apiKey) throw new Error('Missing API key. Set VITE_GOOGLE_API_KEY in .env or save via settings.')

  const base64 = dataUrlToBase64(dataUrl)
  const prompt = buildEraPrompt(era)

  // Try remote AI first; on quota/rate/any failure, fall back to local stylizer
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
        generationConfig: { responseModalities: ['IMAGE'], responseMimeType: 'image/png' },
      }),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json?.error?.message || `HTTP ${res.status}`)
    }
    type Part = { inlineData?: { data?: string } }
    const candidate = json?.candidates?.[0] as { content?: { parts?: Part[] } }
    const part = candidate?.content?.parts?.find((p: Part) => !!p.inlineData)
    const img = part?.inlineData?.data
    if (!img) throw new Error('No image returned from generateContent')
    return `data:image/png;base64,${img}`
  } catch (err: unknown) {
    console.warn('Falling back to local stylizer due to AI error:', err as Error)
    return await localStylize(dataUrl, era)
  }
}

// Local fallback stylizer using Canvas 2D
async function localStylize(dataUrl: string, era: '1970' | '2070'): Promise<string> {
  const img = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)

  // Apply base filter
  if (era === '1970') {
    applyGrayscale(ctx, canvas, 1)
    adjustBrightnessContrast(ctx, canvas, 0.02, 0.18)
    addFilmGrain(ctx, canvas, 0.12)
    addVignette(ctx, canvas, 0.45)
  } else {
    applyFuturistic(ctx, canvas)
    addVignette(ctx, canvas, 0.25, 'rgba(0,255,255,0.35)')
    sharpen(ctx, canvas)
  }
  return canvas.toDataURL('image/png')
}

export type RetroSettings = {
  monochrome: boolean
  brightness: number // -1..1
  contrast: number // 0..2 where 1 is neutral
  sepia: number // 0..1
  grain: number // 0..0.5
  vignette: number // 0..1
  blur: number // 0..1
  sharpen: number // 0..1
}

export async function applyRetroLocal(dataUrl: string, settings: Partial<RetroSettings>): Promise<string> {
  const cfg: RetroSettings = {
    monochrome: true,
    brightness: 0.02,
    contrast: 1.2,
    sepia: 0.0,
    grain: 0.14,
    vignette: 0.4,
    blur: 0.1,
    sharpen: 0.2,
    ...settings,
  }
  const img = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)

  if (cfg.monochrome) applyGrayscale(ctx, canvas, 1)
  if (cfg.sepia > 0) applySepiaAmount(ctx, canvas, cfg.sepia)
  adjustBrightnessContrast(ctx, canvas, cfg.brightness, cfg.contrast - 1)
  if (cfg.blur > 0.01) gaussianBlur(ctx, canvas, cfg.blur)
  if (cfg.sharpen > 0.01) sharpenScaled(ctx, canvas, cfg.sharpen)
  if (cfg.grain > 0.01) addFilmGrain(ctx, canvas, cfg.grain)
  if (cfg.vignette > 0.01) addVignette(ctx, canvas, cfg.vignette)
  return canvas.toDataURL('image/png')
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function applySepia(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { width, height } = canvas
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2]
    d[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b)
    d[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b)
    d[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b)
  }
  ctx.putImageData(imgData, 0, 0)
}

function applySepiaAmount(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, amount: number) {
  const { width, height } = canvas
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2]
    const sr = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b)
    const sg = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b)
    const sb = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b)
    d[i] = lerp(r, sr, amount)
    d[i + 1] = lerp(g, sg, amount)
    d[i + 2] = lerp(b, sb, amount)
  }
  ctx.putImageData(imgData, 0, 0)
}

function applyGrayscale(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, amount: number) {
  const { width, height } = canvas
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2]
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
    d[i] = lerp(r, gray, amount)
    d[i + 1] = lerp(g, gray, amount)
    d[i + 2] = lerp(b, gray, amount)
  }
  ctx.putImageData(imgData, 0, 0)
}

function adjustBrightnessContrast(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, brightnessDelta: number, contrastDelta: number) {
  const { width, height } = canvas
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data
  const b = brightnessDelta * 255
  const c = 1 + contrastDelta
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] * c + b)
    d[i + 1] = clamp(d[i + 1] * c + b)
    d[i + 2] = clamp(d[i + 2] * c + b)
  }
  ctx.putImageData(imgData, 0, 0)
}

function soften(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  // Simple blur via drawImage scaling trick
  const { width, height } = canvas
  const tmp = document.createElement('canvas')
  tmp.width = width
  tmp.height = height
  const tctx = tmp.getContext('2d')!
  tctx.drawImage(canvas, 0, 0, width / 2, height / 2)
  ctx.globalAlpha = 0.6
  ctx.drawImage(tmp, 0, 0, width / 2, height / 2, 0, 0, width, height)
  ctx.globalAlpha = 1
}

function applyFuturistic(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { width, height } = canvas
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    // boost contrast and add cool tint
    let r = d[i], g = d[i + 1], b = d[i + 2]
    r = r * 0.9
    g = g * 1.0
    b = Math.min(255, b * 1.2 + 10)
    // contrast
    r = clamp((r - 128) * 1.15 + 128)
    g = clamp((g - 128) * 1.15 + 128)
    b = clamp((b - 128) * 1.15 + 128)
    d[i] = r; d[i + 1] = g; d[i + 2] = b
  }
  ctx.putImageData(imgData, 0, 0)
}

function sharpen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { width, height } = canvas
  const w = width, h = height
  const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0]
  const side = 3
  const half = Math.floor(side / 2)
  const src = ctx.getImageData(0, 0, w, h)
  const sw = src.width
  const sh = src.height
  const dst = ctx.createImageData(w, h)
  const sdt = src.data
  const ddt = dst.data
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      let r = 0, g = 0, b = 0
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = Math.min(sh - 1, Math.max(0, y + cy - half))
          const scx = Math.min(sw - 1, Math.max(0, x + cx - half))
          const srcOff = (scy * sw + scx) * 4
          const wt = weights[cy * side + cx]
          r += sdt[srcOff] * wt
          g += sdt[srcOff + 1] * wt
          b += sdt[srcOff + 2] * wt
        }
      }
      const dstOff = (y * sw + x) * 4
      ddt[dstOff] = clamp(r + sdt[dstOff])
      ddt[dstOff + 1] = clamp(g + sdt[dstOff + 1])
      ddt[dstOff + 2] = clamp(b + sdt[dstOff + 2])
      ddt[dstOff + 3] = sdt[dstOff + 3]
    }
  }
  ctx.putImageData(dst, 0, 0)
}

function sharpenScaled(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) {
  const times = Math.max(1, Math.round(intensity * 2))
  for (let i = 0; i < times; i++) sharpen(ctx, canvas)
}

function addVignette(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength = 0.35, color = 'black') {
  const grd = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    Math.min(canvas.width, canvas.height) / 4,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) / 1.1
  )
  grd.addColorStop(0, 'rgba(0,0,0,0)')
  grd.addColorStop(1, color === 'black' ? `rgba(0,0,0,${strength})` : color)
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function addFilmGrain(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, amount = 0.12) {
  const grain = document.createElement('canvas')
  grain.width = canvas.width
  grain.height = canvas.height
  const gctx = grain.getContext('2d')!
  const imgData = gctx.createImageData(grain.width, grain.height)
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = (Math.random() * 255) | 0
    imgData.data[i] = v
    imgData.data[i + 1] = v
    imgData.data[i + 2] = v
    imgData.data[i + 3] = Math.floor(255 * amount)
  }
  gctx.putImageData(imgData, 0, 0)
  ctx.globalCompositeOperation = 'overlay'
  ctx.drawImage(grain, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
}

function clamp(v: number) { return Math.max(0, Math.min(255, v)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function gaussianBlur(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, amount: number) {
  // Simple stack blur approximation via multiple small blits
  const iterations = Math.max(1, Math.round(amount * 4))
  const { width, height } = canvas
  const tmp = document.createElement('canvas')
  tmp.width = width
  tmp.height = height
  const tctx = tmp.getContext('2d')!
  for (let i = 0; i < iterations; i++) {
    tctx.clearRect(0, 0, width, height)
    tctx.drawImage(canvas, 0, 0, width, height)
    ctx.globalAlpha = 0.5
    ctx.drawImage(tmp, -1, 0)
    ctx.drawImage(tmp, 1, 0)
    ctx.drawImage(tmp, 0, -1)
    ctx.drawImage(tmp, 0, 1)
    ctx.globalAlpha = 1
  }
}
