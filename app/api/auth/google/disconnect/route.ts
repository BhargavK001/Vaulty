import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    cookieStore.delete('google_access_token')
    cookieStore.delete('google_refresh_token')
    cookieStore.delete('google_email')
    cookieStore.delete('selected_folder_id')
    cookieStore.delete('selected_folder_name')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    )
  }
}
