'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Page() {
  const [prompt_input, setPromptInput] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Fetch the response from the API
      const gpt_response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt_input }),
      });

      // Check if the response is ok
      if (!gpt_response.ok) {
        throw new Error(`HTTP error! status: ${gpt_response.status}`)
      }

      // Parse the response as JSON
      const image_data = await gpt_response.json()

      // setImageUrls as the array of urls in the response
      if (image_data.data && Array.isArray(image_data.data)){
        const urls = image_data.data.map((image: { url: string }) => image.url)
        setImageUrls(urls)
      }
      else{
        throw new Error('No image data in the response, wrong format?')
      }

    } catch (error: any) {
      setError(error.message || 'Something went wrong, please try again.')
    }
    
    setIsLoading(false)
    setPromptInput('')
    console.log("Call to API successfully completed")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Image Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={prompt_input}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full"
        />

        {/* add the loading state to the button too */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Generate Image'}
        </Button>
      </form>

      {/* show error if there is one */}
      {error && <p className="text-red-500">{error}</p>}

      {imageUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Generated ${index + 1}`}
              className="max-w-full h-auto rounded shadow"
            />
          ))}
        </div>
      )}
    </div>
  )
} 