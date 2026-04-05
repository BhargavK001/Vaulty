import { ArchiveFile, ArchiveStats, Category, CategoryInfo, TimelineGroup } from '@/types/archive'
import archiveManifest from '@/data/archive-manifest.json'

export function getArchiveFiles(): ArchiveFile[] {
  return archiveManifest.files as ArchiveFile[]
}

export function getArchiveStats(): ArchiveStats {
  const files = getArchiveFiles()
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  return {
    totalFiles: files.length,
    pdfs: files.filter(f => f.type === 'pdf').length,
    images: files.filter(f => f.type === 'image').length,
    favorites: files.filter(f => f.favorite).length,
    recentUploads: files.filter(f => new Date(f.date) >= thirtyDaysAgo).length
  }
}

export function getCategories(): CategoryInfo[] {
  const files = getArchiveFiles()
  
  const categoryConfig: Record<Category, { label: string; icon: string; color: string }> = {
    academic: { label: 'Academic', icon: 'GraduationCap', color: 'bg-blue-100 dark:bg-blue-900/30' },
    identity: { label: 'Identity', icon: 'CreditCard', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
    finance: { label: 'Finance', icon: 'Wallet', color: 'bg-amber-100 dark:bg-amber-900/30' },
    family: { label: 'Family', icon: 'Users', color: 'bg-rose-100 dark:bg-rose-900/30' },
    property: { label: 'Property', icon: 'Home', color: 'bg-violet-100 dark:bg-violet-900/30' },
    medical: { label: 'Medical', icon: 'Heart', color: 'bg-red-100 dark:bg-red-900/30' },
    certificates: { label: 'Certificates', icon: 'Award', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    receipts: { label: 'Receipts', icon: 'Receipt', color: 'bg-slate-100 dark:bg-slate-800/50' },
    personal: { label: 'Personal', icon: 'User', color: 'bg-indigo-100 dark:bg-indigo-900/30' }
  }
  
  return Object.entries(categoryConfig).map(([id, config]) => ({
    id: id as Category,
    label: config.label,
    icon: config.icon,
    count: files.filter(f => f.category === id).length,
    color: config.color
  }))
}

export function getFilesByCategory(category: Category): ArchiveFile[] {
  return getArchiveFiles().filter(f => f.category === category)
}

export function getFavorites(): ArchiveFile[] {
  return getArchiveFiles().filter(f => f.favorite)
}

export function getRecentFiles(limit = 10): ArchiveFile[] {
  return getArchiveFiles()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function searchFiles(query: string, files: ArchiveFile[]): ArchiveFile[] {
  const lowerQuery = query.toLowerCase()
  return files.filter(f => 
    f.title.toLowerCase().includes(lowerQuery) ||
    f.fileName.toLowerCase().includes(lowerQuery) ||
    f.category.toLowerCase().includes(lowerQuery) ||
    f.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function filterFiles(
  files: ArchiveFile[],
  filters: {
    category?: Category
    type?: 'pdf' | 'image'
    favorite?: boolean
    year?: number
  }
): ArchiveFile[] {
  return files.filter(f => {
    if (filters.category && f.category !== filters.category) return false
    if (filters.type && f.type !== filters.type) return false
    if (filters.favorite && !f.favorite) return false
    if (filters.year && f.year !== filters.year) return false
    return true
  })
}

export function sortFiles(
  files: ArchiveFile[],
  sortBy: 'date' | 'name' | 'type' = 'date',
  order: 'asc' | 'desc' = 'desc'
): ArchiveFile[] {
  const sorted = [...files].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'name':
        return a.title.localeCompare(b.title)
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })
  
  return order === 'desc' ? sorted.reverse() : sorted
}

export function groupByTimeline(files: ArchiveFile[]): TimelineGroup[] {
  const grouped: Record<number, Record<string, ArchiveFile[]>> = {}
  
  files.forEach(file => {
    const date = new Date(file.date)
    const year = date.getFullYear()
    const month = date.toLocaleString('en-US', { month: 'long' })
    
    if (!grouped[year]) grouped[year] = {}
    if (!grouped[year][month]) grouped[year][month] = []
    grouped[year][month].push(file)
  })
  
  return Object.entries(grouped)
    .map(([year, months]) => ({
      year: parseInt(year),
      months: Object.entries(months).map(([month, files]) => ({
        month,
        files: files.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }))
    }))
    .sort((a, b) => b.year - a.year)
}

export function getFileById(id: string): ArchiveFile | undefined {
  return getArchiveFiles().find(f => f.id === id)
}

export function getYears(): number[] {
  const files = getArchiveFiles()
  const years = [...new Set(files.map(f => f.year))]
  return years.sort((a, b) => b - a)
}
