export type FileType = 'pdf' | 'image'
export type FileExtension = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'

export type Category = 
  | 'academic'
  | 'identity'
  | 'finance'
  | 'family'
  | 'property'
  | 'medical'
  | 'certificates'
  | 'receipts'
  | 'personal'

export interface ArchiveFile {
  id: string
  title: string
  fileName: string
  path: string
  type: FileType
  extension: FileExtension
  category: Category
  tags: string[]
  date: string
  year: number
  favorite: boolean
  thumbnail?: string
  description?: string
  mimeType?: string
  size?: number
  webViewLink?: string
  webContentLink?: string
  driveId?: string
}

export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime: string
  createdTime: string
  size?: string
  thumbnailLink?: string
  webViewLink?: string
  webContentLink?: string
  parents?: string[]
  iconLink?: string
}

export interface CategoryInfo {
  id: Category
  label: string
  icon: string
  count: number
  color: string
}

export interface ArchiveStats {
  totalFiles: number
  pdfs: number
  images: number
  favorites: number
  recentUploads: number
}

export interface TimelineGroup {
  year: number
  months: {
    month: string
    files: ArchiveFile[]
  }[]
}

export interface DriveConnectionStatus {
  connected: boolean
  email?: string
  folderId?: string
  folderName?: string
  lastSync?: string
}
