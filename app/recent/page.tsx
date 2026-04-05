'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Cloud, Loader2 } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/layout/animated-page'
import { FileCard } from '@/components/archive/file-card'
import { FilePreviewModal } from '@/components/archive/file-preview-modal'
import { EmptyState } from '@/components/archive/empty-state'
import { Button } from '@/components/ui/button'
import { ArchiveFile } from '@/types/archive'
import { useArchive } from '@/hooks/use-archive'

export default function RecentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null)
  
  const { 
    isLoading, 
    connectionStatus, 
    getRecentFiles, 
    searchFiles,
    toggleFavorite 
  } = useArchive()
  
  const isConnected = connectionStatus.connected && connectionStatus.folderId
  const recentFiles = getRecentFiles(50)
  
  const filteredRecent = useMemo(() => {
    if (!searchQuery) return recentFiles
    const searchResults = searchFiles(searchQuery)
    return recentFiles.filter(f => searchResults.some(s => s.id === f.id))
  }, [searchQuery, recentFiles, searchFiles])
  
  const groupedByDate = useMemo(() => {
    return filteredRecent.reduce((groups, file) => {
      const date = new Date(file.date)
      const now = new Date()
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      let label: string
      if (diffDays === 0) label = 'Today'
      else if (diffDays === 1) label = 'Yesterday'
      else if (diffDays <= 7) label = 'This Week'
      else if (diffDays <= 30) label = 'This Month'
      else label = 'Earlier'
      
      if (!groups[label]) groups[label] = []
      groups[label].push(file)
      return groups
    }, {} as Record<string, ArchiveFile[]>)
  }, [filteredRecent])
  
  const orderedGroups = ['Today', 'Yesterday', 'This Week', 'This Month', 'Earlier']
    .filter(label => groupedByDate[label]?.length > 0)
  
  // Not connected state
  if (!isConnected) {
    return (
      <AnimatedPage>
        <Topbar title="Recent" />
        <div className="px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Connect Google Drive</h2>
            <p className="text-muted-foreground mb-8">
              Connect your Google Drive to see your recently accessed documents.
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
  
  // Loading state
  if (isLoading) {
    return (
      <AnimatedPage>
        <Topbar title="Recent" />
        <div className="px-4 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading recent documents...</p>
          </div>
        </div>
      </AnimatedPage>
    )
  }
  
  return (
    <AnimatedPage>
      <Topbar 
        onSearch={setSearchQuery} 
        searchValue={searchQuery}
        title="Recent" 
      />
      
      <div className="px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Recent</h1>
              <p className="text-muted-foreground">
                Your most recently accessed documents
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Recent Files */}
        {filteredRecent.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={searchQuery ? "No documents found" : "No recent documents"}
            description={
              searchQuery
                ? "Try adjusting your search to find what you're looking for."
                : "Documents you view or upload will appear here."
            }
          />
        ) : (
          <div className="space-y-10">
            {orderedGroups.map((label, groupIndex) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">{label}</h2>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {groupedByDate[label].map((file, index) => (
                    <motion.div key={file.id} variants={staggerItem}>
                      <FileCard
                        file={file}
                        delay={index * 0.02}
                        onClick={() => setSelectedFile(file)}
                        onFavoriteClick={() => toggleFavorite(file.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <FilePreviewModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onFavoriteToggle={() => selectedFile && toggleFavorite(selectedFile.id)}
      />
    </AnimatedPage>
  )
}
