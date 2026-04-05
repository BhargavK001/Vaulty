'use client'

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import { ArchiveFile, DriveConnectionStatus, ArchiveStats, Category, CategoryInfo, TimelineGroup } from '@/types/archive'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useArchive() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('archive_favorites')
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)))
    }
  }, [])

  // Get connection status
  const getConnectionStatus = useCallback((): DriveConnectionStatus => {
    if (typeof window === 'undefined') {
      return { connected: false }
    }
    
    const email = document.cookie
      .split('; ')
      .find(row => row.startsWith('google_email='))
      ?.split('=')[1]
    
    const folderId = document.cookie
      .split('; ')
      .find(row => row.startsWith('selected_folder_id='))
      ?.split('=')[1]
    
    const folderName = document.cookie
      .split('; ')
      .find(row => row.startsWith('selected_folder_name='))
      ?.split('=')[1]

    const recentFoldersCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('recent_folders='))
      ?.split('=')[1]
    
    let recentFolders = []
    if (recentFoldersCookie) {
      try {
        recentFolders = JSON.parse(decodeURIComponent(recentFoldersCookie))
      } catch (e) {
        console.error('Error parsing recent folders cookie:', e)
      }
    }

    return {
      connected: !!email,
      email: email ? decodeURIComponent(email) : undefined,
      folderId: folderId ? decodeURIComponent(folderId) : undefined,
      folderName: folderName ? decodeURIComponent(folderName) : undefined,
      recentFolders
    }
  }, [])

  const [connectionStatus, setConnectionStatus] = useState<DriveConnectionStatus>({ connected: false })
  
  useEffect(() => {
    setConnectionStatus(getConnectionStatus())
  }, [getConnectionStatus])

  // Fetch files from Google Drive
  const { data: filesData, error: filesError, isLoading, mutate } = useSWR(
    connectionStatus.folderId ? `/api/drive/files?folderId=${connectionStatus.folderId}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000 
    }
  )

  const files: ArchiveFile[] = filesData?.files?.map((file: ArchiveFile) => ({
    ...file,
    favorite: favorites.has(file.id)
  })) || []

  // Toggle favorite
  const toggleFavorite = useCallback((fileId: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(fileId)) {
        next.delete(fileId)
      } else {
        next.add(fileId)
      }
      localStorage.setItem('archive_favorites', JSON.stringify([...next]))
      return next
    })
  }, [])

  // Get stats
  const getStats = useCallback((): ArchiveStats => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    return {
      totalFiles: files.length,
      pdfs: files.filter(f => f.type === 'pdf').length,
      images: files.filter(f => f.type === 'image').length,
      favorites: files.filter(f => favorites.has(f.id)).length,
      recentUploads: files.filter(f => new Date(f.date) >= thirtyDaysAgo).length
    }
  }, [files, favorites])

  // Get categories
  const getCategories = useCallback((): CategoryInfo[] => {
    const categoryConfig: Record<Category, { label: string; icon: string; color: string }> = {
      academic: { label: 'Academic', icon: 'GraduationCap', color: 'bg-blue-500/10 dark:bg-blue-500/20' },
      identity: { label: 'Identity', icon: 'CreditCard', color: 'bg-emerald-500/10 dark:bg-emerald-500/20' },
      finance: { label: 'Finance', icon: 'Wallet', color: 'bg-amber-500/10 dark:bg-amber-500/20' },
      family: { label: 'Family', icon: 'Users', color: 'bg-rose-500/10 dark:bg-rose-500/20' },
      property: { label: 'Property', icon: 'Home', color: 'bg-violet-500/10 dark:bg-violet-500/20' },
      medical: { label: 'Medical', icon: 'Heart', color: 'bg-red-500/10 dark:bg-red-500/20' },
      certificates: { label: 'Certificates', icon: 'Award', color: 'bg-yellow-500/10 dark:bg-yellow-500/20' },
      receipts: { label: 'Receipts', icon: 'Receipt', color: 'bg-slate-500/10 dark:bg-slate-500/20' },
      personal: { label: 'Personal', icon: 'User', color: 'bg-indigo-500/10 dark:bg-indigo-500/20' }
    }
    
    return Object.entries(categoryConfig).map(([id, config]) => ({
      id: id as Category,
      label: config.label,
      icon: config.icon,
      count: files.filter(f => f.category === id).length,
      color: config.color
    }))
  }, [files])

  // Get files by category
  const getFilesByCategory = useCallback((category: Category): ArchiveFile[] => {
    return files.filter(f => f.category === category)
  }, [files])

  // Get favorites
  const getFavorites = useCallback((): ArchiveFile[] => {
    return files.filter(f => favorites.has(f.id))
  }, [files, favorites])

  // Get recent files
  const getRecentFiles = useCallback((limit = 10): ArchiveFile[] => {
    return [...files]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }, [files])

  // Search files
  const searchFiles = useCallback((query: string): ArchiveFile[] => {
    const lowerQuery = query.toLowerCase()
    return files.filter(f => 
      f.title.toLowerCase().includes(lowerQuery) ||
      f.fileName.toLowerCase().includes(lowerQuery) ||
      f.category.toLowerCase().includes(lowerQuery) ||
      f.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }, [files])

  // Filter files
  const filterFiles = useCallback((
    filters: {
      category?: Category
      type?: 'pdf' | 'image'
      favorite?: boolean
      year?: number
    }
  ): ArchiveFile[] => {
    return files.filter(f => {
      if (filters.category && f.category !== filters.category) return false
      if (filters.type && f.type !== filters.type) return false
      if (filters.favorite && !favorites.has(f.id)) return false
      if (filters.year && f.year !== filters.year) return false
      return true
    })
  }, [files, favorites])

  // Sort files
  const sortFiles = useCallback((
    filesToSort: ArchiveFile[],
    sortBy: 'date' | 'name' | 'type' = 'date',
    order: 'asc' | 'desc' = 'desc'
  ): ArchiveFile[] => {
    const sorted = [...filesToSort].sort((a, b) => {
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
  }, [])

  // Group by timeline
  const groupByTimeline = useCallback((filesToGroup: ArchiveFile[]): TimelineGroup[] => {
    const grouped: Record<number, Record<string, ArchiveFile[]>> = {}
    
    filesToGroup.forEach(file => {
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
        months: Object.entries(months).map(([month, monthFiles]) => ({
          month,
          files: monthFiles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }))
      }))
      .sort((a, b) => b.year - a.year)
  }, [])

  // Get years
  const getYears = useCallback((): number[] => {
    const years = [...new Set(files.map(f => f.year))]
    return years.sort((a, b) => b - a)
  }, [files])

  // Refresh data
  const refresh = useCallback(() => {
    mutate()
    setConnectionStatus(getConnectionStatus())
  }, [mutate, getConnectionStatus])

  return {
    files,
    isLoading,
    error: filesError,
    connectionStatus,
    toggleFavorite,
    getStats,
    getCategories,
    getFilesByCategory,
    getFavorites,
    getRecentFiles,
    searchFiles,
    filterFiles,
    sortFiles,
    groupByTimeline,
    getYears,
    refresh
  }
}
