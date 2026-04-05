import { google } from 'googleapis'
import { ArchiveFile, ArchiveFolder, GoogleDriveFile, Category, FileType, FileExtension } from '@/types/archive'

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
]

export function getGoogleAuthUrl() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  )

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

export function getOAuth2Client(accessToken?: string, refreshToken?: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  )

  if (accessToken) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  }

  return oauth2Client
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}

export async function getUserEmail(accessToken: string) {
  const oauth2Client = getOAuth2Client(accessToken)
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data } = await oauth2.userinfo.get()
  return data.email
}

export async function listDriveFolders(accessToken: string) {
  const oauth2Client = getOAuth2Client(accessToken)
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const response = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: 'files(id, name, modifiedTime)',
    orderBy: 'name'
  })

  return response.data.files || []
}

export async function listFilesInFolder(accessToken: string, folderId: string): Promise<GoogleDriveFile[]> {
  const oauth2Client = getOAuth2Client(accessToken)
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const supportedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]

  const mimeTypeQuery = supportedMimeTypes.map(type => `mimeType='${type}'`).join(' or ')
  
  const response = await drive.files.list({
    q: `'${folderId}' in parents and (${mimeTypeQuery}) and trashed=false`,
    fields: 'files(id, name, mimeType, modifiedTime, createdTime, size, thumbnailLink, webViewLink, webContentLink, iconLink)',
    orderBy: 'modifiedTime desc',
    pageSize: 100
  })

  return (response.data.files || []) as GoogleDriveFile[]
}

export async function listAllFilesRecursively(
  accessToken: string, 
  folderId: string, 
  folderPath: string = ''
): Promise<{ files: GoogleDriveFile[], folders: ArchiveFolder[] }> {
  const oauth2Client = getOAuth2Client(accessToken)
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  let allFiles: GoogleDriveFile[] = []
  let allFolders: ArchiveFolder[] = []

  // Get files in current folder
  const files = await listFilesInFolder(accessToken, folderId)
  allFiles = allFiles.concat(files.map(f => ({ ...f, parents: [folderPath] })))

  // Get subfolders
  const foldersResponse = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name, modifiedTime)'
  })

  const subfolders = foldersResponse.data.files || []

  for (const subfolder of subfolders) {
    if (subfolder.id && subfolder.name) {
      const newPath = folderPath ? `${folderPath}/${subfolder.name}` : subfolder.name
      
      // Add this folder to our list
      allFolders.push({
        id: subfolder.id,
        name: subfolder.name,
        path: folderPath || '/',
        parentId: folderId,
        modifiedTime: subfolder.modifiedTime || new Date().toISOString(),
        itemCount: 0
      })

      const result = await listAllFilesRecursively(accessToken, subfolder.id, newPath)
      allFiles = allFiles.concat(result.files)
      allFolders = allFolders.concat(result.folders)
    }
  }

  return { files: allFiles, folders: allFolders }
}

export function inferCategoryFromPath(path: string, fileName: string): Category {
  const lowerPath = (path + '/' + fileName).toLowerCase()
  
  if (lowerPath.includes('academic') || lowerPath.includes('school') || lowerPath.includes('college') || lowerPath.includes('university') || lowerPath.includes('degree') || lowerPath.includes('marksheet') || lowerPath.includes('result')) {
    return 'academic'
  }
  if (lowerPath.includes('identity') || lowerPath.includes('aadhar') || lowerPath.includes('aadhaar') || lowerPath.includes('pan') || lowerPath.includes('passport') || lowerPath.includes('voter') || lowerPath.includes('license') || lowerPath.includes('driving')) {
    return 'identity'
  }
  if (lowerPath.includes('finance') || lowerPath.includes('bank') || lowerPath.includes('tax') || lowerPath.includes('investment') || lowerPath.includes('loan')) {
    return 'finance'
  }
  if (lowerPath.includes('family') || lowerPath.includes('birth') || lowerPath.includes('marriage') || lowerPath.includes('death')) {
    return 'family'
  }
  if (lowerPath.includes('property') || lowerPath.includes('house') || lowerPath.includes('land') || lowerPath.includes('deed') || lowerPath.includes('registry')) {
    return 'property'
  }
  if (lowerPath.includes('medical') || lowerPath.includes('health') || lowerPath.includes('hospital') || lowerPath.includes('report') || lowerPath.includes('prescription')) {
    return 'medical'
  }
  if (lowerPath.includes('certificate') || lowerPath.includes('award') || lowerPath.includes('diploma')) {
    return 'certificates'
  }
  if (lowerPath.includes('receipt') || lowerPath.includes('invoice') || lowerPath.includes('bill')) {
    return 'receipts'
  }
  
  return 'personal'
}

export function convertDriveFileToArchiveFile(driveFile: GoogleDriveFile, folderPath: string = ''): ArchiveFile {
  const fileName = driveFile.name
  const extension = fileName.split('.').pop()?.toLowerCase() as FileExtension || 'jpg'
  const type: FileType = driveFile.mimeType === 'application/pdf' ? 'pdf' : 'image'
  const date = new Date(driveFile.modifiedTime || driveFile.createdTime)
  const category = inferCategoryFromPath(folderPath, fileName)
  
  // Generate title from filename
  const title = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())

  return {
    id: driveFile.id,
    title,
    fileName,
    path: folderPath || '/',
    type,
    extension,
    category,
    tags: [category, type],
    date: date.toISOString(),
    year: date.getFullYear(),
    favorite: false,
    thumbnail: driveFile.thumbnailLink?.replace('=s220', '=s400'),
    webViewLink: driveFile.webViewLink,
    webContentLink: driveFile.webContentLink,
    mimeType: driveFile.mimeType,
    size: driveFile.size ? parseInt(driveFile.size) : undefined,
    driveId: driveFile.id
  }
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown'
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0
  let size = bytes
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}
