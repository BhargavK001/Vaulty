import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { listDriveFolders, refreshAccessToken } from '@/lib/google-drive'

export async function GET() {
  try {
    const cookieStore = await cookies()
    let accessToken = cookieStore.get('google_access_token')?.value
    const refreshToken = cookieStore.get('google_refresh_token')?.value

    if (!accessToken && refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken)
      accessToken = newTokens.access_token || undefined
      
      if (accessToken) {
        cookieStore.set('google_access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60
        })
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const folders = await listDriveFolders(accessToken)
    return NextResponse.json({ folders })
  } catch (error) {
    console.error('Error listing folders:', error)
    return NextResponse.json(
      { error: 'Failed to list folders' },
      { status: 500 }
    )
  }
}
