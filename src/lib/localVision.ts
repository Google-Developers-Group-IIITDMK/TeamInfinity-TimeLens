import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'

export type LocalAnalysis = {
  faces: number
  avgFaceScore: number
  brightness: number // 0..1
  contrast: number // 0..1 (approx)
}

let faceModel: blazeface.BlazeFaceModel | null = null

async function ensureFaceModel(): Promise<blazeface.BlazeFaceModel> {
  if (!faceModel) {
    faceModel = await blazeface.load()
  }
  return faceModel
}

export async function analyzeImage(dataUrl: string): Promise<LocalAnalysis> {
  try {
    await tf.ready()
    const img = await loadImage(dataUrl)
    const resized = drawToOffscreen(img, 256, 256)

    const [faces, brightness, contrast] = await Promise.all([
      detectFaces(resized).catch(() => []),
      Promise.resolve(estimateBrightness(resized)),
      Promise.resolve(estimateContrast(resized))
    ])

    return {
      faces: (faces as { probability?: number }[]).length,
      avgFaceScore: (faces as { probability?: number }[]).length
        ? (faces as { probability?: number }[]).reduce((a, f) => a + (f.probability || 0), 0) / (faces as { probability?: number }[]).length
        : 0,
      brightness,
      contrast
    }
  } catch (e) {
    console.warn('analyzeImage fallback', e)
    return { faces: 0, avgFaceScore: 0, brightness: 0.5, contrast: 0.3 }
  }
}

async function detectFaces(canvas: HTMLCanvasElement) {
  try {
    const model = await ensureFaceModel()
    const predictions = await model.estimateFaces(canvas, false)
    return predictions.map(p => ({
      probability: Array.isArray((p as any).probability) ? (p as any).probability[0] : 0.9
    }))
  } catch (e) {
    console.warn('detectFaces failed', e)
    return []
  }
}

function estimateBrightness(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d')!
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  let sum = 0
  const n = width * height
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    sum += y
  }
  return Math.max(0, Math.min(1, sum / (n * 255)))
}

function estimateContrast(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d')!
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  let sum = 0
  let sumSq = 0
  let count = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    sum += y
    sumSq += y * y
    count++
  }
  const mean = sum / count
  const variance = Math.max(0, sumSq / count - mean * mean)
  const std = Math.sqrt(variance)
  return Math.max(0, Math.min(1, std / 128))
}

function drawToOffscreen(img: HTMLImageElement, maxW: number, maxH: number) {
  const ratio = Math.min(maxW / img.width, maxH / img.height, 1)
  const w = Math.max(1, Math.round(img.width * ratio))
  const h = Math.max(1, Math.round(img.height * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  return canvas
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export function pickTemplateLocally(templates: { id: string; name: string; imageUrl: string }[], a: LocalAnalysis) {
  // Simple heuristic: if faces detected, prefer relationship/reaction memes; else situational
  const prefer = a.faces > 0 ? ['boyfriend','drake','cat','robin','spongebob'] : ['fine','buttons','skeleton','harold','brain']
  const scored = templates.map(t => {
    const name = t.name.toLowerCase()
    const match = prefer.some(k => name.includes(k)) ? 1 : 0
    const score = match + (a.brightness > 0.5 ? 0.1 : 0) + (a.contrast > 0.4 ? 0.1 : 0)
    return { t, score: score + Math.random() * 0.2 }
  })
  scored.sort((x, y) => y.score - x.score)
  return scored[0]?.t || templates[0]
}


