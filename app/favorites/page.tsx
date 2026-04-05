'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Cloud, Loader2 } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/layout/animated-page'
import { FileCard } from '@/components/archive/file-card'
import { FilePreviewModal } from '@/components/archive/file-preview-modal'
import { EmptyState } from '@/components/archive/empty-state'
import { Button } from '@/components/ui/button'
import { ArchiveFile } from '@/types/archive'
import { useArchive } from '@/hooks/use-archive'

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null)
  
  const { 
    isLoading, 
    connectionStatus, 
    getFavorites, 
    searchFiles,
    toggleFavorite 
  } = useArchive()
  
  const isConnected = connectionStatus.connected && connectionStatus.folderId
  const favorites = getFavorites()
  const filteredFavorites = searchQuery 
    ? searchFiles(searchQuery).filter(f => favorites.some(fav => fav.id === f.id))
    : favorites
  
  // Not connected state
  if (!isConnected) {
    return (
      <AnimatedPage>
        <Topbar title="Favorites" />
        <div className="px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Connect Google Drive</h2>
            <p className="text-muted-foreground mb-8">
              Connect your Google Drive to mark and view your favorite documents.
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
        <Topbar title="Favorites" />
        <div className="px-4 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your favorites...</p>
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
        title="Favorites" 
      />
      
      <div className="px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center">
              <Heart className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Favorites</h1>
              <p className="text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'document' : 'documents'} you&apos;ve marked as important
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={searchQuery ? "No favorites found" : "No favorites yet"}
            description={
              searchQuery 
                ? "Try adjusting your search to find your favorite documents."
                : "Mark documents as favorites to see them here. Your most important files, always within reach."
            }
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredFavorites.map((file, index) => (
              <motion.div key={file.id} variants={staggerItem}>
                <FileCard
                  file={file}
                  delay={index * 0.03}
                  onClick={() => setSelectedFile(file)}
                  onFavoriteClick={() => toggleFavorite(file.id)}
                />
              </motion.div>
            ))}
          </motion.div>
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
