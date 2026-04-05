'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarDays, Cloud, Loader2 } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage } from '@/components/layout/animated-page'
import { TimelineSection } from '@/components/archive/timeline-section'
import { FilePreviewModal } from '@/components/archive/file-preview-modal'
import { EmptyState } from '@/components/archive/empty-state'
import { Button } from '@/components/ui/button'
import { ArchiveFile } from '@/types/archive'
import { useArchive } from '@/hooks/use-archive'

export default function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null)
  
  const { 
    files, 
    isLoading, 
    connectionStatus, 
    searchFiles, 
    groupByTimeline,
    toggleFavorite 
  } = useArchive()
  
  const isConnected = connectionStatus.connected && connectionStatus.folderId
  
  const filteredFiles = useMemo(() => {
    return searchQuery ? searchFiles(searchQuery) : files
  }, [searchQuery, files, searchFiles])
  
  const timeline = useMemo(() => {
    return groupByTimeline(filteredFiles)
  }, [filteredFiles, groupByTimeline])
  
  const totalYears = timeline.length
  const oldestYear = timeline[timeline.length - 1]?.year
  const newestYear = timeline[0]?.year
  
  // Not connected state
  if (!isConnected) {
    return (
      <AnimatedPage>
        <Topbar title="Timeline" />
        <div className="px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Connect Google Drive</h2>
            <p className="text-muted-foreground mb-8">
              Connect your Google Drive to view your documents organized by time.
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
        <Topbar title="Timeline" />
        <div className="px-4 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading timeline...</p>
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
        title="Timeline" 
      />
      
      <div className="px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <CalendarDays className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Timeline</h1>
              <p className="text-muted-foreground">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'document' : 'documents'} spanning {totalYears} {totalYears === 1 ? 'year' : 'years'}
                {oldestYear && newestYear && oldestYear !== newestYear && (
                  <span className="text-foreground font-medium"> ({oldestYear} - {newestYear})</span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Timeline Content */}
        {timeline.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={searchQuery ? "No documents found" : "No documents yet"}
            description={
              searchQuery
                ? "Try adjusting your search to find what you're looking for."
                : "Add documents to your archive to see them organized by time."
            }
          />
        ) : (
          <div className="space-y-12">
            {timeline.map((yearGroup, index) => (
              <TimelineSection
                key={yearGroup.year}
                group={yearGroup}
                delay={index * 0.1}
                onFileClick={setSelectedFile}
              />
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
