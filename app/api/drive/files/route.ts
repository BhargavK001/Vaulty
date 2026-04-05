import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { listAllFilesRecursively, convertDriveFileToArchiveFile, refreshAccessToken } from '@/lib/google-drive'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folderId = searchParams.get('folderId')

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID required' },
        { status: 400 }
      )
    }

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

    const driveFiles = await listAllFilesRecursively(accessToken, folderId)
    const archiveFiles = driveFiles.map(file => 
      convertDriveFileToArchiveFile(file, file.parents?.[0] || '')
    )

    return NextResponse.json({ files: archiveFiles })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}
