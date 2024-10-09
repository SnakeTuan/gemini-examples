'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'

export function Page() {
  const [prompt_input, setPromptInput] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try{
      const response = await fetch('api/conversation',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt_input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResponse(data.response)
      console.log("setResponse: ", data.response)
      
    } catch (error: any) {
      setError(error.message || 'Something went wrong calling the API, please try again.')
    }

    setPromptInput('')
    setIsLoading(false)
    console.log("Call to API successfully completed")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Conversation Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={prompt_input}
          onChange={(event) => setPromptInput(event.target.value)}
          placeholder="Enter your message here..."
          className="w-full"
        />

        {/* add the loading state to the button too */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Generate Response'}
        </Button>
      </form>

      {/* show error message if there is one */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* show response if there is one */}
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}