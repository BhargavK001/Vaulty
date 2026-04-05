'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Files, 
  FileText, 
  Image, 
  Heart, 
  Clock, 
  ArrowRight,
  Cloud,
  Sparkles,
  FolderOpen
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/layout/animated-page'
import { StatsCard } from '@/components/archive/stats-card'
import { FileCard } from '@/components/archive/file-card'
import { CategoryCard } from '@/components/archive/category-card'
import { Button } from '@/components/ui/button'
import { useArchive } from '@/hooks/use-archive'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { 
    files, 
    isLoading, 
    connectionStatus, 
    getStats, 
    getRecentFiles, 
    getCategories, 
    groupByTimeline,
    toggleFavorite 
  } = useArchive()
  
  const stats = getStats()
  
  // Filter categories based on search
  const categories = getCategories()
    .filter(c => c.count > 0)
    .filter(c => !searchQuery || c.label.toLowerCase().includes(searchQuery.toLowerCase()))
    
  // Filter recent files based on search
  const allRecentFiles = getRecentFiles(20)
  const filteredRecentFiles = searchQuery 
    ? allRecentFiles.filter(f => 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRecentFiles.slice(0, 6)
    
  const timeline = groupByTimeline(searchQuery ? filteredRecentFiles : allRecentFiles.slice(0, 20))
  const isConnected = connectionStatus.connected && connectionStatus.folderId
  
  return (
    <AnimatedPage>
      <Topbar onSearch={setSearchQuery} searchValue={searchQuery} />
      
      <div className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative overflow-hidden rounded-[2rem] glass p-8 lg:p-12">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent via-accent/50 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 glow-sm"
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
                  Welcome to your
                  <br />
                  <span className="bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent inline-block">
                    {connectionStatus.connected && connectionStatus.folderName 
                      ? connectionStatus.folderName 
                      : 'Vaulty'}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  A calm place for every important document. Your digital memory vault for certificates, IDs, family records, and precious memories.
                </p>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  {isConnected ? (
                    <>
                      <Link href="/archive">
                        <Button className="rounded-2xl h-12 px-6 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                          Browse Archive
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/categories">
                        <Button variant="outline" className="rounded-2xl h-12 px-6 text-sm font-medium glass border-border/50 hover:bg-accent/50">
                          View Categories
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/settings">
                      <Button className="rounded-2xl h-12 px-6 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                        <Cloud className="mr-2 w-4 h-4" />
                        Connect Google Drive
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Stats preview */}
              {isConnected && (
                <div className="flex gap-4 lg:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-4xl lg:text-5xl font-bold text-foreground">{stats.totalFiles}</div>
                    <div className="text-sm text-muted-foreground mt-1">Documents</div>
                  </motion.div>
                  <div className="w-px bg-border/50" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-4xl lg:text-5xl font-bold text-foreground">{categories.length}</div>
                    <div className="text-sm text-muted-foreground mt-1">Categories</div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </motion.section>
        
        {/* Not connected state */}
        {!isConnected && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="glass rounded-3xl p-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mx-auto mb-6">
                <Cloud className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Connect to Google Drive</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Link your Google Drive to automatically import and organize your documents. 
                Your files stay secure in your own Drive.
              </p>
              <Link href="/settings">
                <Button className="rounded-2xl h-12 px-8">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.section>
        )}
        
        {/* Loading state */}
        {isConnected && isLoading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="glass rounded-3xl p-12 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your documents from Google Drive...</p>
            </div>
          </motion.section>
        )}
        
        {/* Connected and loaded state */}
        {isConnected && !isLoading && (
          <>
            {/* Stats Section */}
            <section className="mb-12">
              <h2 className="text-lg font-semibold text-foreground mb-6">Quick Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                  title="Total Files"
                  value={stats.totalFiles}
                  icon={Files}
                  delay={0.1}
                />
                <StatsCard
                  title="PDFs"
                  value={stats.pdfs}
                  icon={FileText}
                  delay={0.15}
                />
                <StatsCard
                  title="Images"
                  value={stats.images}
                  icon={Image}
                  delay={0.2}
                />
                <StatsCard
                  title="Favorites"
                  value={stats.favorites}
                  icon={Heart}
                  delay={0.25}
                />
                <StatsCard
                  title="Recent"
                  value={stats.recentUploads}
                  icon={Clock}
                  description="Last 30 days"
                  delay={0.3}
                  className="col-span-2 lg:col-span-1"
                />
              </div>
            </section>
            
            {/* Recent Documents */}
            {filteredRecentFiles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
                  <Link href="/recent">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl group">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredRecentFiles.slice(0, 6).map((file, index) => (
                    <motion.div key={file.id} variants={staggerItem}>
                      <FileCard 
                        file={file} 
                        delay={index * 0.05} 
                        onFavoriteClick={() => toggleFavorite(file.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}
            
            {/* Categories */}
            {categories.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Categories</h2>
                  <Link href="/categories">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl group">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categories.slice(0, 5).map((category, index) => (
                    <CategoryCard 
                      key={category.id} 
                      category={category} 
                      delay={index * 0.05} 
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Timeline Preview */}
            {timeline.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
                  <Link href="/timeline">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl group">
                      Full Timeline
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-8">
                  {timeline.slice(0, 2).map((yearGroup, yearIndex) => (
                    <motion.div
                      key={yearGroup.year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: yearIndex * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl font-bold bg-linear-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                          {yearGroup.year}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {yearGroup.months.slice(0, 1).flatMap(monthGroup => 
                          monthGroup.files.slice(0, 6).map((file, fileIndex) => (
                            <FileCard 
                              key={file.id} 
                              file={file} 
                              variant="compact"
                              delay={fileIndex * 0.03}
                              onFavoriteClick={() => toggleFavorite(file.id)}
                            />
                          ))
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Empty state */}
            {files.length === 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No documents found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your selected Google Drive folder is empty. Add some documents to get started!
                </p>
              </motion.section>
            )}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}
