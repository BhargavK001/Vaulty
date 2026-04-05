'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Grid3X3, Cloud, Loader2 } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/layout/animated-page'
import { CategoryCard } from '@/components/archive/category-card'
import { EmptyState } from '@/components/archive/empty-state'
import { Button } from '@/components/ui/button'
import { useArchive } from '@/hooks/use-archive'

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const { isLoading, connectionStatus, getCategories } = useArchive()
  
  const isConnected = connectionStatus.connected && connectionStatus.folderId
  const categories = getCategories()
  
  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories
  
  const totalDocuments = categories.reduce((acc, cat) => acc + cat.count, 0)
  const activeCategories = categories.filter(c => c.count > 0)
  
  // Not connected state
  if (!isConnected) {
    return (
      <AnimatedPage>
        <Topbar title="Categories" />
        <div className="px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-10 h-10 text-violet-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Connect Google Drive</h2>
            <p className="text-muted-foreground mb-8">
              Connect your Google Drive to organize your documents by category.
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
        <Topbar title="Categories" />
        <div className="px-4 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading categories...</p>
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
        title="Categories" 
      />
      
      <div className="px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center">
              <Grid3X3 className="w-7 h-7 text-violet-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
              <p className="text-muted-foreground">
                {totalDocuments} {totalDocuments === 1 ? 'document' : 'documents'} organized across {activeCategories.length} {activeCategories.length === 1 ? 'category' : 'categories'}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={Grid3X3}
            title="No categories found"
            description="Try adjusting your search to find what you're looking for."
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredCategories.map((category, index) => (
              <motion.div key={category.id} variants={staggerItem}>
                <CategoryCard 
                  category={category} 
                  delay={index * 0.05}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  )
}
