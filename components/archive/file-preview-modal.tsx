'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  Heart, 
  ExternalLink, 
  Copy, 
  Calendar, 
  Tag,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  HardDrive
} from 'lucide-react'
import { ArchiveFile } from '@/types/archive'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FilePreviewModalProps {
  file: ArchiveFile | null
  onClose: () => void
  onFavoriteToggle?: () => void
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  academic: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  identity: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  finance: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  family: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20' },
  property: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/20' },
  medical: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' },
  certificates: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20' },
  receipts: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20' },
  personal: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
}

function formatFileSize(bytes?: number): string {
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

export function FilePreviewModal({ file, onClose, onFavoriteToggle }: FilePreviewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (file) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [file, onClose])
  
  const handleCopyLink = () => {
    if (file?.webViewLink) {
      navigator.clipboard.writeText(file.webViewLink)
      toast.success('Link copied to clipboard')
    }
  }
  
  const handleDownload = () => {
    if (file?.webContentLink) {
      window.open(file.webContentLink, '_blank')
      toast.success('Download started')
    } else if (file?.webViewLink) {
      window.open(file.webViewLink, '_blank')
    }
  }
  
  const handleOpenInDrive = () => {
    if (file?.webViewLink) {
      window.open(file.webViewLink, '_blank')
    }
  }
  
  const isImage = file?.type === 'image'
  const colors = file ? (categoryColors[file.category] || categoryColors.personal) : categoryColors.personal
  const hasThumbnail = !!file?.thumbnail
  
  return (
    <AnimatePresence>
      {file && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 lg:inset-12 bg-card rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-border/50"
          >
            {/* Preview Area */}
            <div className="flex-1 bg-muted/30 flex items-center justify-center p-8 relative min-h-[300px] lg:min-h-0 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-50">
                <div className={cn(
                  "absolute inset-0",
                  isImage 
                    ? "bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" 
                    : "bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"
                )} />
              </div>
              
              {/* Thumbnail or placeholder */}
              {hasThumbnail ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative z-10 w-full max-w-2xl max-h-full aspect-auto rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={file.thumbnail!}
                    alt={file.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </motion.div>
              ) : isImage ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative z-10 w-full max-w-2xl aspect-[4/3] rounded-3xl glass shadow-xl overflow-hidden flex items-center justify-center"
                >
                  <ImageIcon className="w-24 h-24 text-emerald-500/40" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative z-10 w-full max-w-sm aspect-[3/4] rounded-3xl glass shadow-xl overflow-hidden flex flex-col"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <FileText className="w-24 h-24 text-blue-500/40" />
                  </div>
                  <div className="p-6 bg-background/50 border-t border-border/50">
                    <p className="font-medium text-foreground truncate">{file.fileName}</p>
                    <p className="text-sm text-muted-foreground">PDF Document</p>
                  </div>
                </motion.div>
              )}
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-11 h-11 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Details Panel */}
            <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-border/50 p-6 overflow-y-auto bg-background">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">{file.title}</h2>
                  <p className="text-sm text-muted-foreground font-mono">{file.fileName}</p>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={handleOpenInDrive} 
                    className="rounded-xl flex-1 gap-2 shadow-lg shadow-primary/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Drive
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDownload} 
                    className="rounded-xl flex-1 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onFavoriteToggle}
                    className="rounded-xl gap-2 px-4"
                  >
                    <Heart className={cn(
                      "w-4 h-4 transition-colors", 
                      file.favorite && "fill-rose-500 text-rose-500"
                    )} />
                  </Button>
                </div>
                
                <Separator className="bg-border/50" />
                
                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Category</p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs mt-0.5 capitalize border",
                            colors.bg, colors.text, colors.border
                          )}
                        >
                          {file.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                        {isImage ? (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Type</p>
                        <p className="text-foreground font-medium">{file.extension.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Modified</p>
                        <p className="text-foreground font-medium">
                          {new Date(file.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {file.size && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                          <HardDrive className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground text-xs">Size</p>
                          <p className="text-foreground font-medium">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                {file.description && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">Description</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{file.description}</p>
                    </div>
                  </>
                )}
                
                {/* Tags */}
                {file.tags.length > 0 && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {file.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="rounded-full text-xs capitalize">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Path / Link */}
                {file.webViewLink && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">Drive Link</h3>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-muted/50 px-3 py-2.5 rounded-xl text-muted-foreground truncate">
                          {file.webViewLink}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleCopyLink} 
                          className="shrink-0 rounded-xl hover:bg-muted/50"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
