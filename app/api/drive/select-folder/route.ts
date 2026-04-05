import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { folderId, folderName } = await request.json()

    if (!folderId || !folderName) {
      return NextResponse.json(
        { error: 'Folder ID and name required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    
    cookieStore.set('selected_folder_id', folderId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    })
    
    cookieStore.set('selected_folder_name', folderName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error selecting folder:', error)
    return NextResponse.json(
      { error: 'Failed to select folder' },
      { status: 500 }
    )
  }
}
