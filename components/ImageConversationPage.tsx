'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Page() {
  const [prompt, setPrompt] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt || !selectedImage) {
      setError("Please provide both a prompt and an image.")
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse('')

    try {
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('image', selectedImage)

      const res = await fetch('/api/imageConversation', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }

    setIsLoading(false)
    setPrompt('')
    setSelectedImage(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Generate Content with Image and Message</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Content'}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}