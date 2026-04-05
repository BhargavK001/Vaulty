'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Cloud, FolderOpen, ChevronRight, Home } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/layout/animated-page'
import { FilterBar } from '@/components/archive/filter-bar'
import { FileCard } from '@/components/archive/file-card'
import { FolderCard, FolderCardList } from '@/components/archive/folder-card'
import { EmptyState } from '@/components/archive/empty-state'
import { FilePreviewModal } from '@/components/archive/file-preview-modal'
import { Button } from '@/components/ui/button'
import { ArchiveFile, ArchiveFolder, Category } from '@/types/archive'
import { useArchive } from '@/hooks/use-archive'
import { FileSkeleton, FileSkeletonList } from '@/components/archive/file-skeleton'
import { cn } from '@/lib/utils'

function ArchiveContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as Category | null
  
  const { 
    files: allFiles, 
    folders: allFolders,
    isLoading, 
    connectionStatus,
    searchFiles,
    filterFiles,
    sortFiles,
    getYears,
    toggleFavorite
  } = useArchive()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(categoryParam || undefined)
  const [selectedType, setSelectedType] = useState<'pdf' | 'image' | undefined>()
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null)
  
  // Navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: 'Root' }
  ])
  
  const years = getYears()
  const isConnected = connectionStatus.connected && connectionStatus.folderId
  const skeletons = Array(8).fill(0)
  
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Reset navigation when archive root changes
  useEffect(() => {
    setCurrentFolderId(null)
    setBreadcrumbs([{ id: null, name: connectionStatus.folderName || 'Vaulty' }])
  }, [connectionStatus.folderId, connectionStatus.folderName])
  
  const filteredFiles = useMemo(() => {
    let files = allFiles
    
    // Apply path filtering if not searching
    if (!searchQuery) {
      files = allFiles.filter(f => {
        if (currentFolderId === null) {
          return f.path === '/' || f.path === ''
        } else {
          // Find the folder path for currentFolderId
          const currentFolder = allFolders.find(fld => fld.id === currentFolderId)
          if (!currentFolder) return false
          const expectedPath = currentFolder.path === '/' 
            ? currentFolder.name 
            : `${currentFolder.path}/${currentFolder.name}`
          return f.path === expectedPath
        }
      })
    }
    
    // Apply other filters
    files = filterFiles({
      category: selectedCategory,
      type: selectedType,
      favorite: showFavorites || undefined,
      year: selectedYear,
    }, files)
    
    // Apply search to the filtered results
    if (searchQuery) {
      files = searchFiles(searchQuery, files)
    }
    
    return sortFiles(files, sortBy, sortOrder)
  }, [allFiles, allFolders, searchQuery, currentFolderId, selectedCategory, selectedType, showFavorites, selectedYear, sortBy, sortOrder, searchFiles, filterFiles, sortFiles])

  const currentFolders = useMemo(() => {
    if (searchQuery) return [] // Don't show folders during search for now
    
    return allFolders.filter(fld => fld.parentId === (currentFolderId || connectionStatus.folderId))
  }, [allFolders, currentFolderId, connectionStatus.folderId, searchQuery])
  
  const handleClearFilters = () => {
    setSelectedCategory(undefined)
    setSelectedType(undefined)
    setShowFavorites(false)
    setSelectedYear(undefined)
    setSearchQuery('')
  }
  
  const handleSortChange = (newSortBy: 'date' | 'name' | 'type', newOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newOrder)
  }

  const navigateToFolder = (folder: ArchiveFolder) => {
    setCurrentFolderId(folder.id)
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }])
  }

  const navigateToBreadcrumb = (index: number) => {
    const target = breadcrumbs[index]
    setCurrentFolderId(target.id)
    setBreadcrumbs(breadcrumbs.slice(0, index + 1))
  }
  
  // Not connected state
  if (!isConnected) {
    return (
      <AnimatedPage>
        <Topbar title="Archive" />
        <div className="px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Connect Google Drive</h2>
            <p className="text-muted-foreground mb-8">
              Connect your Google Drive to browse and organize your documents.
            </p>
            <Link href="/settings">
              <Button className="rounded-2xl h-12 px-8">
                Go to Settings
              </Button>
            </Link>
          </motion.div>
        </div>
      </AnimatedPage>
    )
  }
  
  return (
    <AnimatedPage>
      <Topbar 
        onSearch={setSearchQuery} 
        searchValue={searchQuery}
        title="Archive" 
      />
      
      <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        <FilterBar
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          showFavorites={showFavorites}
          sortBy={sortBy}
          sortOrder={sortOrder}
          viewMode={viewMode}
          years={years}
          selectedYear={selectedYear}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
          onFavoriteToggle={() => setShowFavorites(!showFavorites)}
          onSortChange={handleSortChange}
          onViewModeChange={setViewMode}
          onYearChange={setSelectedYear}
          onClearFilters={handleClearFilters}
        />

        {/* Breadcrumbs */}
        {!searchQuery && (
          <div className="flex items-center gap-2 mt-8 mb-4 overflow-x-auto no-scrollbar py-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center shrink-0">
                {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground/40 mx-1" />}
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all",
                    index === breadcrumbs.length - 1 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  <span className="text-sm truncate max-w-[120px]">{crumb.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          {isLoading ? (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-3"
            )}>
              {skeletons.map((_, i) => (
                viewMode === 'grid' ? <FileSkeleton key={i} /> : <FileSkeletonList key={i} />
              ))}
            </div>
          ) : filteredFiles.length === 0 && currentFolders.length === 0 ? (
            <EmptyState
              icon={allFiles.length === 0 ? FolderOpen : Search}
              title={allFiles.length === 0 ? "No documents yet" : "No documents found"}
              description={
                allFiles.length === 0 
                  ? "Your selected Google Drive folder appears to be empty. Add some documents to get started!"
                  : "Try adjusting your filters or search query to find what you're looking for."
              }
              action={allFiles.length > 0 ? {
                label: 'Clear Filters',
                onClick: handleClearFilters
              } : undefined}
            />
          ) : (
            <>
              {!searchQuery && (
                <p className="text-sm text-muted-foreground mb-6">
                  {currentFolders.length > 0 && `${currentFolders.length} folders, `}
                  {filteredFiles.length} {filteredFiles.length === 1 ? 'document' : 'documents'}
                </p>
              )}
              
              {viewMode === 'grid' ? (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {/* Render Folders First */}
                  <AnimatePresence>
                    {currentFolders.map((folder, index) => (
                      <motion.div key={folder.id} variants={staggerItem}>
                        <FolderCard
                          folder={folder}
                          delay={index * 0.03}
                          onClick={() => navigateToFolder(folder)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Render Files */}
                  {filteredFiles.map((file, index) => (
                    <motion.div key={file.id} variants={staggerItem}>
                      <FileCard
                        file={file}
                        delay={(currentFolders.length + index) * 0.03}
                        onClick={() => setSelectedFile(file)}
                        onFavoriteClick={() => toggleFavorite(file.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-3"
                >
                  {/* Folders List */}
                  {currentFolders.map((folder, index) => (
                    <motion.div key={folder.id} variants={staggerItem}>
                      <FolderCardList
                        folder={folder}
                        delay={index * 0.02}
                        onClick={() => navigateToFolder(folder)}
                      />
                    </motion.div>
                  ))}

                  {/* Files List */}
                  {filteredFiles.map((file, index) => (
                    <motion.div key={file.id} variants={staggerItem}>
                      <FileCard
                        file={file}
                        variant="compact"
                        delay={(currentFolders.length + index) * 0.02}
                        onClick={() => setSelectedFile(file)}
                        onFavoriteClick={() => toggleFavorite(file.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      
      <FilePreviewModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onFavoriteToggle={() => selectedFile && toggleFavorite(selectedFile.id)}
      />
    </AnimatedPage>
  )
}

export default function ArchivePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ArchiveContent />
    </Suspense>
  )
}
