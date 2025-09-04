import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { platform, url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    let location: string | null = null

    // Fetch profile HTML with user-agent to mimic browser
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    })

    const html = response.data
    const $ = cheerio.load(html)

    if (platform === 'instagram') {
      // Instagram location extraction
      // Look for bio section
      const bioSection = $('meta[property="og:description"]').attr('content') || ''
      const bioLocation = bioSection.match(/📍\s*([^📍\n]+)/) || bioSection.match(/located in ([^,.]+)/i)

      if (bioLocation) {
        location = bioLocation[1].trim()
      }

      // Look for location in JSON data if available
      $('script[type="application/ld+json"]').each((_, elem) => {
        try {
          const jsonData = JSON.parse($(elem).html() || '{}')
          if (jsonData['@type'] === 'ProfilePage' && jsonData.location) {
            location = location || jsonData.location.name || jsonData.location.address
          }
        } catch {}
      })

      // Fallback: look for 'location' anywhere in text
      if (!location) {
        const locationText = $('body').text().match(/\blocation[:\s]*([^\n,.]+)/i)
        if (locationText) {
          location = locationText[1].trim()
        }
      }
    } else if (platform === 'facebook') {
      // Facebook location extraction
      // Look for profile location
      const locationDiv = $('.contact-wrapper .contact-item').filter((_, elem) => {
        const text = $(elem).text()
        return text.includes('Lives in') || text.includes('From')
      })

      if (locationDiv.length > 0) {
        location = locationDiv.text().replace(/Lives in|From\s*/i, '').trim()
      }

      // Alternative: look for location in profile info
      if (!location) {
        $('script[type="application/ld+json"]').each((_, elem) => {
          try {
            const jsonData = JSON.parse($(elem).html() || '{}')
            if (jsonData.location) {
              location = jsonData.location
            }
          } catch {}
        })
      }

      // Fallback: search text content
      if (!location) {
        const locationPattern = $('body').text().match(/\b(lives in|from)\s+([^\n,.]+)/i)
        if (locationPattern) {
          location = locationPattern[2].trim()
        }
      }
    }

    return NextResponse.json({
      platform,
      url,
      location,
      success: !!location,
    })

  } catch (error) {
    console.error('Track location error:', error)
    return NextResponse.json({
      error: 'Failed to fetch profile data. The profile may be private, URL invalid, or temporarily unavailable.',
    }, { status: 500 })
  }
}