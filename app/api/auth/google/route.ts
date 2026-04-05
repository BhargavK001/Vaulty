import { NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-drive'

export async function GET() {
  try {
    const authUrl = getGoogleAuthUrl()
    return NextResponse.json({ url: authUrl })
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}
