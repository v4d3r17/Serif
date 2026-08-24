import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/server'

export const maxDuration = 60;

// Define the schema for the generated blog post
const blogSchema = z.object({
  title: z.string().describe('The title of the blog post'),
  summary: z.string().describe('A short 2-3 sentence summary of the post'),
  body: z.string().describe('The main content of the blog post formatted in HTML. Use semantic tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc. Do not include a main <h1> title in the body.'),
  slug: z.string().describe('A URL-friendly slug based on the title (e.g., how-to-use-ai)'),
  read_time: z.number().describe('Estimated reading time in minutes (integer)'),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY,
    })

    // Generate the blog content using OpenAI and Zod schema
    const { object } = await generateObject({
      model: openai('gpt-4o'), // Using gpt-4o as the standard model
      schema: blogSchema,
      prompt: `Write a high-quality blog post about the following topic or instructions:\n\n${prompt}\n\nMake the content engaging, professional, and well-structured.`,
    })

    // Insert the generated post into Supabase as a Draft
    const { data: blog, error } = await supabase
      .from('blogs')
      .insert({
        user_id: user.id,
        title: object.title,
        summary: object.summary,
        body: object.body,
        slug: object.slug,
        read_time: object.read_time,
        status: 'Draft',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 })
    }

    return NextResponse.json({ id: blog.id })
  } catch (error: Error | unknown) {
    console.error('Error generating blog:', error)
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : 'An error occurred') || 'An error occurred while generating the blog post.' }, 
      { status: 500 }
    )
  }
}
