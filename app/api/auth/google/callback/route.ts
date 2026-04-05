import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode, getUserEmail } from '@/lib/google-drive'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/settings?error=access_denied', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url))
  }

  try {
    const tokens = await getTokensFromCode(code)
    
    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    const email = await getUserEmail(tokens.access_token)

    const cookieStore = await cookies()
    
    // Store tokens in secure cookies
    cookieStore.set('google_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    })

    if (tokens.refresh_token) {
      cookieStore.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    if (email) {
      cookieStore.set('google_email', email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      })
    }

    return NextResponse.redirect(new URL('/settings?success=connected', request.url))
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    return NextResponse.redirect(new URL('/settings?error=token_exchange_failed', request.url))
  }
}
