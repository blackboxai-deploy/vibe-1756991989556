'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LocationResult {
  platform: string
  url: string
  location: string | null
  error: string | null
}

export default function Home() {
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<LocationResult[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!instagramUrl && !facebookUrl) return

    setLoading(true)
    setResults([])

    const requests = []

    if (instagramUrl) {
      requests.push(fetchLocation('instagram', instagramUrl))
    }
    if (facebookUrl) {
      requests.push(fetchLocation('facebook', facebookUrl))
    }

    const responseResults = await Promise.all(requests)
    setResults(responseResults)
    setLoading(false)
  }

  const fetchLocation = async (platform: string, url: string): Promise<LocationResult> => {
    try {
      const response = await fetch('/api/track-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, url }),
      })

      const data = await response.json()

      return {
        platform,
        url,
        location: data.location || null,
        error: data.error || null,
      }
    } catch (err) {
      return {
        platform,
        url,
        location: null,
        error: 'Network error',
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Profile Location Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Enter Instagram or Facebook profile links to extract location information.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Privacy Notice:</strong> This tool uses web scraping techniques for educational purposes.
            Please ensure you have permission to access profile information. Web scraping may violate terms of service.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Profile URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Profile URL
              </label>
              <Input
                id="instagram"
                type="url"
                placeholder="https://instagram.com/username"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Profile URL
              </label>
              <Input
                id="facebook"
                type="url"
                placeholder="https://facebook.com/username"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading || (!instagramUrl && !facebookUrl)}>
              {loading ? 'Extracting Location...' : 'Track Location'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className={result.error ? 'border-red-200' : 'border-green-200'}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold capitalize">{result.platform}</h3>
                <span className={`px-2 py-1 rounded text-sm ${result.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {result.error ? 'Error' : 'Success'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{result.url}</p>
              {result.error ? (
                <p className="text-red-600">{result.error}</p>
              ) : result.location ? (
                <p className="text-green-600">
                  <strong>Extracted Location:</strong> {result.location}
                </p>
              ) : (
                <p className="text-gray-500">No location information found</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}