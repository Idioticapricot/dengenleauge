import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

const BASE_PROMPT = "Create a high-detail pixel art dragon with no background. Render a perfect, symmetric side view of the entire dragon, showcasing its elongated body, detailed scales, and vibrant colors in crisp pixel style. The image should capture the dragon in full profile with clean lines and a balanced composition, emphasizing its majestic form without any additional elements."

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { description, tier, stats } = await request.json()

    if (!description || !tier || !stats) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const enhancedPrompt = `${BASE_PROMPT} ${description}`

    const result = await fal.subscribe("fal-ai/flux-1/schnell", {
      input: {
        prompt: enhancedPrompt
      }
    })

    return NextResponse.json({ imageUrl: result.data.images[0].url })
  } catch (error) {
    console.error('Beast creation error:', error)
    return NextResponse.json({ error: 'Failed to create beast' }, { status: 500 })
  }
}